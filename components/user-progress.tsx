/**
 * User Progress Display Component
 * 
 * Shows the user's current progress including active course, points, and hearts.
 * This component appears in the header/navigation area to provide quick access to user stats.
 */

import { Button } from "@/components/ui/button";
import { courses } from "@/db/schema";
import { InfinityIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
    activeCourse: typeof courses.$inferSelect; // Current selected course
    hearts: number; // Number of lives/attempts remaining
    points: number; // Total points earned
    hasActiveSubscription: boolean; // Whether user has LangQuest Plus
};

/**
 * User progress component displaying course, points, and hearts
 * 
 * Features:
 * - Active course indicator with course flag
 * - Points display with shop link
 * - Hearts display (shows infinity for subscribers)
 * - All elements are clickable and lead to relevant pages
 * 
 * @param activeCourse - Currently active course object
 * @param points - User's total points
 * @param hearts - User's remaining hearts
 * @param hasActiveSubscription - Whether user has premium subscription
 * @returns Header component with user progress indicators
 */
export const UserProgress = ({ activeCourse, points, hearts, hasActiveSubscription }: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            {/* Active Course Button - Links to course selection */}
            <Link href="/courses">
                <Button variant ="ghost">
                    <Image src={activeCourse.imageSrc} alt={activeCourse.title} className="rounded-md border" height={32} width={32}>

                    </Image>
                </Button>
            </Link>
            
            {/* Points Display - Links to shop */}
            <Link href="/shop">
                <Button variant ="ghost" className="text-orange-500">
                    <Image src="/points.svg" height={28} width={28} alt="Points" className="mr-2"/>
                    {points}
                </Button>
            </Link>
            
            {/* Hearts Display - Shows infinity for subscribers, actual count for free users */}
            <Link href="/shop">
                <Button variant ="ghost" className="text-rose-500">
                    <Image src="/heart.svg" height={22} width={22} alt="Heart" className="mr-2"/>
                    {hasActiveSubscription?<InfinityIcon className="h-4 w-4 stroke-[3]" />:hearts}
                </Button>
            </Link>
        </div>
    );
};