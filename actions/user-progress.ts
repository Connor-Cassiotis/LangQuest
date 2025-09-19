"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, is } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("User not authenticated");
    }

    const course = await getCourseById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    //if (!course.units.length || course.units[0].lessons.length === 0) {
        //throw new Error("Course has no lessons");
    //}

    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: course.id,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.png"
        }).where(eq(userProgress.userId, userId));
    } else {
        await db.insert(userProgress).values({
            userId,
            activeCourseId: course.id,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.png"
        });
    }

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
    

};

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }
    const currentUserProgress = await getUserProgress();
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });
    if (!challenge) {
        throw new Error("Challenge not found");
    }
    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        ),
    });
    const isPractice = !!existingChallengeProgress
    if (isPractice) {
        return {error: "practice"};
    }
    if (!currentUserProgress ) {
        throw new Error("User progress not found");
    }
    if (currentUserProgress.hearts === 0) {
        return {error: "heart"};
    }
    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/shop");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();
    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }
    if (currentUserProgress.hearts === 5) {
        throw new Error("Hearts are already full");
    }

    if (currentUserProgress.points < 50) {
        throw new Error("Not enough points");
    }

    await db.update(userProgress).set({
        hearts: 5,
        points: currentUserProgress.points - 50,
    }).where(eq(userProgress.userId, currentUserProgress.userId))
    revalidatePath("/learn");
    revalidatePath("/shop");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
}  
