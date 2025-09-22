/**
 * Course List Component
 * 
 * Interactive grid component displaying available courses with selection functionality.
 * Handles course enrollment and navigation with loading states.
 */

"use client";
import { useRouter } from "next/navigation";
import { Card } from "./card";
import { courses, userProgress } from "@/db/schema";
import { useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
    courses: typeof courses.$inferSelect[]; // Array of available courses
    activeCourseId?: typeof userProgress.$inferSelect.activeCourseId; // Currently active course ID
};

/**
 * Course list component with interactive course cards
 * 
 * Features:
 * - Responsive grid layout
 * - Course enrollment with loading states
 * - Active course highlighting
 * - Error handling with toast notifications
 * - Navigation to learn page for active course
 * 
 * @param courses - Array of available courses to display
 * @param activeCourseId - ID of the user's currently active course
 * @returns Grid of interactive course cards
 */
export const List = ({ courses, activeCourseId}: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    /**
     * Handles course selection and enrollment
     * 
     * @param id - Course ID to select/enroll in
     */
    const onClick = (id: number) => {
        if (pending) return; // Prevent double-clicks during loading
        
        // If clicking active course, navigate to learn page
        if (id === activeCourseId) {
            return router.push("/learn");
        }
        
        // Enroll in new course with loading state
        startTransition(() => {
            upsertUserProgress(id)
                .catch((error) => {
                    // Don't show error for redirects (Next.js redirect throws internally)
                    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
                        return;
                    }
                    console.error("Error updating user progress:", error);
                    toast.error("Something went wrong. Please try again.");
                });
        });

    };
    
    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {courses.map((course) => (
                <Card 
                    key={course.id} 
                    id={course.id} 
                    title={course.title} 
                    imageSrc={course.imageSrc} 
                    onClick={onClick} 
                    disabled={pending} 
                    active={course.id === activeCourseId} 
                />
            ))}
        </div>
    );
};