/**
 * Lesson Page Component
 * 
 * Entry point for individual lessons that fetches lesson data and initializes the quiz.
 * Validates user progress and lesson availability before rendering the interactive quiz.
 */

import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";

/**
 * Lesson page component that prepares and renders a quiz
 * 
 * Features:
 * - Fetches lesson and user progress data
 * - Validates lesson availability and user authentication
 * - Calculates initial completion percentage
 * - Initializes quiz with proper state
 * - Handles redirection for invalid states
 * 
 * @returns Quiz component with lesson data or redirects if invalid
 */
const LessonPage = async () => {
    // Fetch lesson and user data in parallel
    const lessonData = getLesson();
    const userProgressData = getUserProgress();
    const [lesson, userProgress] = await Promise.all([lessonData, userProgressData]);

    // Redirect if no progress or lesson found
    if (!userProgress || !lesson) {
        redirect("/learn");
    }

    // Calculate initial completion percentage based on completed challenges
    const initialPercentage = lesson.challenges.filter((challenge) => challenge.completed)
        .length / lesson.challenges.length * 100;
        
    return (
        <Quiz 
            initialLessonId={lesson.id}  
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={null}
        />
    );

};

export default LessonPage;