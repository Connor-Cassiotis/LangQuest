"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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
    

}