import Image from "next/image";
import { Button } from "./button";
import  Link  from "next/link";
import { userProgress } from "@/db/schema";
import { Progress } from "./progress";

 type Props = {
    points: number;
};
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
    ];

export const Quests = ({ points}: Props) => {
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between w-full space-y-2">
                <h3 className="font-bold text-lg">
                    Quests
                </h3>
            
            <Link href="/quests">
                <Button variant="primaryOutline" className="w-full" size="sm" >
                    View all
                </Button>
            </Link>
            </div>
            <ul className="w-full space-y-4">
                {quests.map((quest) => {
                    const progress = (points / quest.value) * 100;
                        return (
                            <div
                                key={quest.title}
                                className="flex items-center w-full p-4 gap-x-3 border-t-2"
                            >
                                <Image src="/points.svg" alt="Points" width={40} height={40} />
                                <div className="flex flex-col gap-y-2 w-full">
                                    <p className="text-neutral-700 text-sm font-bold">
                                        {quest.title}
                                    </p>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </div>
                        );
                    })}
            </ul>
        </div>
    );  
};