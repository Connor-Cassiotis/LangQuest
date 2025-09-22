/**
 * Courses Page Component
 * 
 * Course selection page where users can view and choose from available language courses.
 * Displays all courses in a grid layout with the user's current active course highlighted.
 */

import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

/**
 * Course selection page component
 * 
 * Features:
 * - Displays all available language courses
 * - Shows user's currently active course
 * - Responsive grid layout
 * - Course enrollment functionality
 * 
 * @returns Course selection page with course grid
 */
const CoursesPage = async () => {
    // Fetch available courses and user's current progress
    const courses = await getCourses();
    const userProgress = await getUserProgress();
    
    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Course Page
            </h1>
            <List 
                courses={courses}
                activeCourseId={userProgress?.activeCourseId}
            
            />
        </div>
    );
};

export default CoursesPage;