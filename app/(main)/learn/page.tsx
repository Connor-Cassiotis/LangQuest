/**
 * Learn Page Component
 * 
 * Main learning dashboard where users view their course progress and access lessons.
 * Displays course units, lessons, user progress, and promotional content.
 */

import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { title } from "process";
import { getUnits, getUserProgress, getCourseProgress, getLessonPercentage, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { Promo } from "@/components/ui/promo";
import { Quests } from "@/components/ui/quests";

/**
 * Learning dashboard page component
 * 
 * Features:
 * - User progress tracking and display
 * - Course units and lesson progression
 * - Sidebar with user stats, quests, and promotions
 * - Responsive two-column layout
 * - Subscription-based promotional content
 * - Progress validation and redirection
 * 
 * @returns Learning dashboard with course content and user progress
 */
const LearnPage = async () => {
    // Fetch all required data in parallel for optimal performance
    const userProgressData = getUserProgress();
    const unitsData = getUnits();
    const courseProgressData = getCourseProgress();
    const lessonPercentageData = getLessonPercentage();
    const userSubscriptionData = getUserSubscription();
    const [userProgress, units, courseProgress, lessonPercentage, userSubscription] = await Promise.all([userProgressData, unitsData, courseProgressData, lessonPercentageData, userSubscriptionData]);

    // Redirect to course selection if no progress or active course
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
    if (!courseProgress) {
        redirect("/courses");
    }
    
    const isPro = !!userSubscription?.isActive;
    
    return (
        <div>
            <div className="flex flex-row-reverse gap-[48px] px-6">
                {/* Right Sidebar - User Progress and Promotions */}
                <StickyWrapper>
                    <UserProgress 
                        activeCourse={ userProgress.activeCourse }
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSubscription={isPro}
                    />
                    {/* Show promotion only to non-subscribers */}
                    {!isPro && (<Promo />)}
                    <Quests points={userProgress.points} />
                </StickyWrapper>
                
                {/* Main Content - Course Units and Lessons */}
                <FeedWrapper>
                    <Header title={userProgress.activeCourse.title} />
                    {units.map((unit) => (
                        <div key={unit.id} className="mb-10">
                            <Unit 
                                id={unit.id}
                                order={unit.order}
                                description={unit.description}
                                title={unit.title}
                                lessons={unit.lessons}
                                activeLesson={courseProgress.activeLesson}
                                activeLessonPercentage={lessonPercentage}
                            />
                        </div>
                    ))}
                </FeedWrapper>
            </div>

        </div>
    );
};
export default LearnPage;