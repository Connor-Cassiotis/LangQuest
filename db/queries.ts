/**
 * Database Query Functions
 * 
 * This module contains cached database query functions for the LangQuest application.
 * All queries are wrapped with React's cache() to prevent unnecessary re-fetching
 * during server-side rendering and improve performance.
 */

import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { challengeProgress, courses, lessons, units, userProgress, userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves the current user's progress information including active course
 * 
 * @returns User progress object with active course data, or null if user not authenticated
 */
export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if (!userId) return null;

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true
        }
    });
    return data;
});

/**
 * Retrieves all units for the user's active course with lesson completion status
 * 
 * @returns Array of units with lessons and challenge completion data
 */
export const getUnits = cache(async ()=> {

    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId){
        return [];
    }

    // Fetch units with nested lessons, challenges, and progress data
    const data = await db.query.units.findMany({
        orderBy: (units, { asc}) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons:{
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with : {
                    challenges: {
                        orderBy: (challenges, { asc }) => [asc(challenges.order)],
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    // Transform data to include completion status for each lesson
    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            if(
                lesson.challenges.length === 0
            ) {
                return {...lesson, completed: false };
            }
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
            });
            return {...lesson, completed: allCompletedChallenges };
        });
        return {...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;

});

/**
 * Retrieves all available courses
 * 
 * @returns Array of all courses
 */
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data;
});

/**
 * Retrieves a specific course by ID
 * 
 * @param courseId - The ID of the course to retrieve
 * @returns Course object or undefined if not found
 */
export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });
    return data;
});

/**
 * Gets the user's course progress and determines the next lesson to complete
 * 
 * @returns Object containing active lesson information or null if no progress
 */
export const getCourseProgress = cache(async () => {
    const { userId } = await auth(); 
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }
    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc}) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with:{
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },

                },
            },
        },
    }); 

    // Find the first lesson with incomplete challenges
    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            return lesson.challenges.some((challenge) => {
                return !challenge.challengeProgress || challenge.challengeProgress.length === 0 || challenge.challengeProgress.some((progress) => !progress.completed); 
            });
        });
    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };

});

/**
 * Retrieves a specific lesson with its challenges and completion status
 * 
 * @param id - Optional lesson ID, defaults to user's active lesson
 * @returns Lesson object with challenges and completion data, or null if not found
 */
export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }
    const courseProgress = await getCourseProgress();
    
    const lessonId = id || courseProgress?.activeLessonId;
    if (!lessonId) {
        return null;
    }
    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),

                    },
                },
            },
        },
    });
    if (!data || !data.challenges) {
        return null;
    }
    
    // Transform challenges to include completion status
    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
        return {...challenge, completed};
    });
    return {...data, challenges: normalizedChallenges };
});

/**
 * Calculates the completion percentage of the user's active lesson
 * 
 * @returns Percentage (0-100) of challenges completed in the active lesson
 */
export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();
    if (!courseProgress?.activeLesson) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLesson.id);
    if (!lesson) {
        return 0;
    }
    
    // Calculate percentage based on completed challenges
    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);
    return percentage;
});

/**
 * Retrieves the user's subscription information and checks if it's active
 * 
 * @returns Subscription object with active status, or null if no subscription
 */
export const getUserSubscription = cache(async () => {
    const { userId } = await auth();
    const DAY_IN_MS = 86_400_000; // 24 hours in milliseconds
    
    if (!userId) {
        return null;
    }
    
    const data = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId)
    });

    if (!data) {
        return null;
    }
    
    // Check if subscription is still active (current period end + 1 day grace period)
    const isActive = data.stripePriceId && data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
    return {
        ...data,
        isActive: !!isActive,
    };
});

/**
 * Retrieves the top 10 users by points for the leaderboard
 * 
 * @returns Array of top 10 users with their points and profile information
 */
export const getTopTenUsers = cache(async () => {
    const {userId} = await auth();
    if (!userId) {
        return [];
    }
    
    // Get top 10 users by points for leaderboard display
    const data = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
        columns: {
            userId: true,
            userName: true,
            userImageSrc: true,
            points: true,
        },
    });
    return data;
});
