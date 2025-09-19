"use client"

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import { on } from "events";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;

};
export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
    const [pending, startTransition] = useTransition();
    const onRefilHearts = () => {
        if (pending || hearts === 5 || points < 50) return;
        startTransition(() => {
            refillHearts().catch(() => {
                toast.error("Something went wrong");
            });
        });
    };

    const onUpgrade = () => {
        startTransition(() => {
            createStripeUrl()
                .then((response) => {
                    if(response.data) {
                        window.location.href = response.data;
                    }
                })
                .catch(() => {
                    toast.error("Something went wrong");
                });
        });
    };

    return (
        <ul className="w-full">
            <div  className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src="/heart.svg"
                    alt="Heart"
                    width={60}
                    height={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill 5 hearts
                    </p>

                </div>
                <Button onClick={onRefilHearts} disabled={hearts === 5 || points < 50 || pending} variant="secondary">
                    {hearts === 5 ? "full" : (<div className="flex items-center">
                        <Image
                            src="/points.svg"
                            alt="Points"
                            width={20}
                            height={20}
                        />
                        <p>
                            50
                        </p>
                    </div>)}
                </Button>
            </div>
            <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                <Image
                    src="/unlimited.svg"
                    alt="Unlimited"
                    width={60}
                    height={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Unlimited hearts
                    </p>
                </div>
                <Button onClick={onUpgrade} disabled={pending || hasActiveSubscription} variant="secondary">
                    {hasActiveSubscription ? "Active" : "Upgrade"}
                </Button>
            </div>
        </ul>
    );
};