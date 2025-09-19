import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";
import {  } from "@/db/schema";

const ShopPage = async () => {
    const userSubscriptionsData = getUserSubscription();
    const userProgressData = getUserProgress();
    const [userProgress,userSubscriptions] = await Promise.all([userProgressData,userSubscriptionsData]);
    
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
    
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points ={userProgress.points}
                    hasActiveSubscription={!!userSubscriptions?.isActive}
                />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image 
                        src="/shop.svg"
                        alt="Shop"
                        width={90}
                        height={90}
                    />
                    
                </div>
                <h1 className ="text-center font-bold text-neutral-800 text-2xl my-6">
                    Shop
                </h1>
                <p className="text-muted-foreground text-center text-lg mb-6">
                    Spend your points on cool stuff.
                </p>
                <Items 
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={!!userSubscriptions?.isActive}
                />
            </FeedWrapper>
        </div>
    );
};
export default ShopPage;