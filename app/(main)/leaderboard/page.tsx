import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import {  } from "@/db/schema";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/ui/promo";
import { Quests } from "@/components/ui/quests";

const LeaderBoardPage = async () => {
    const userSubscriptionsData = getUserSubscription();
    const userProgressData = getUserProgress();
    const leaderBoardData = getTopTenUsers();
    const [userProgress,userSubscriptions, leaderboard] = await Promise.all([userProgressData,userSubscriptionsData, leaderBoardData]);
    
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const isPro = !!userSubscriptions?.isActive;
    
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points ={userProgress.points}
                    hasActiveSubscription={!!userSubscriptions?.isActive}
                />
                {!isPro && (<Promo />)}
                <Quests points={userProgress.points} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image 
                        src="/leaderboard.svg"
                        alt="Leaderboard"
                        width={90}
                        height={90}
                    />
                    
                </div>
                <h1 className ="text-center font-bold text-neutral-800 text-2xl my-6">
                    Leaderboard
                </h1>
                <p className="text-muted-foreground text-center text-lg mb-6">
                    See how you stack up against others.
                </p>
                <Separator className="mb-4 h-0.5 rounded-full"/>
                {leaderboard.map((userProgress, index) => (
                    <div key={userProgress.userId} className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50">
                        <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
                        <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                            <AvatarImage 
                                className="object-cover"
                                src={userProgress.userImageSrc}

                            />
                        </Avatar>
                        <p className="font-bold text-neutral-800 flex-1">
                            {userProgress.userName}
                        </p>
                        <p className="text-muted-foreground">
                            {userProgress.points} XP
                        </p>
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};
export default LeaderBoardPage;