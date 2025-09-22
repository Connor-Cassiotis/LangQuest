/**
 * Quests Page Component
 * 
 * Gamification page displaying user challenges and progress milestones.
 * Shows XP-based quests with visual progress indicators to motivate continued learning.
 */

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import {  } from "@/db/schema";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/ui/promo";

/**
 * Quests page component showing user challenges and milestones
 * 
 * Features:
 * - XP-based quest system with multiple difficulty levels
 * - Visual progress bars showing completion status
 * - User progress sidebar with stats
 * - Promotional content for non-subscribers
 * - Responsive two-column layout
 * - Progress validation and redirection
 * 
 * @returns Quests page with challenge list and user progress
 */
const QuestsPage = async () => {
    // Define available quests with XP requirements
    const quests = [
        {
            title: "Earn 20 XP",
            value: 20,
        },
                {
            title: "Earn 50 XP",
            value: 50,
        },
        {
            title: "Earn 100 XP",
            value: 100,
        },
        {
            title: "Earn 500 XP",
            value: 500,
        },
        {
            title: "Earn 1000 XP",
            value: 1000,
        }
    ]
    
    // Fetch user data in parallel
    const userSubscriptionsData = getUserSubscription();
    const userProgressData = getUserProgress();
    const [userProgress,userSubscriptions] = await Promise.all([userProgressData,userSubscriptionsData]);
    
    // Redirect to course selection if no progress
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
    
    const isPro = !!userSubscriptions?.isActive;
    
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            {/* Right Sidebar - User Progress and Promotions */}
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points ={userProgress.points}
                    hasActiveSubscription={!!userSubscriptions?.isActive}
                />
                {/* Show promotion only to non-subscribers */}
                {!isPro && (<Promo />)}
            </StickyWrapper>
            
            {/* Main Content - Quest List */}
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    {/* Quest Header */}
                    <Image 
                        src="/quests.svg"
                        alt="Quests"
                        width={90}
                        height={90}
                    />
                    
                <h1 className ="text-center font-bold text-neutral-800 text-2xl my-6">
                    Quest
                </h1>
                <p className="text-muted-foreground text-center text-lg mb-6">
                    Complete quests by earning points.
                </p>
                
                {/* Quest List with Progress Bars */}
                <ul className="w-full">
                    {quests.map((quest) => {
                        // Calculate progress percentage for each quest
                        const progress = (userProgress.points / quest.value) * 100;
                        return (
                            <div
                                key={quest.title}
                                className="flex items-center w-full p-4 gap-x-4 border-t-2"
                            >
                                <Image src="/points.svg" alt="Points" width={60} height={60} />
                                <div className="flex flex-col gap-y-2 w-full">
                                    <p className="text-neutral-700 text-xl font-bold">
                                        {quest.title}
                                    </p>
                                    <Progress value={progress} className="h-3" />
                                </div>
                            </div>
                        );
                    })}
                </ul>
                </div>
            </FeedWrapper>
        </div>
    );
};
export default QuestsPage;