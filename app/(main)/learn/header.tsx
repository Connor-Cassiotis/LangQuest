/**
 * Learn Page Header Component
 * 
 * Header component for the learning dashboard displaying the current course title
 * and navigation back to course selection.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
    title: string; // Current course title to display
};

/**
 * Header component for the learn page
 * 
 * Features:
 * - Sticky positioning at top of page
 * - Back button to course selection
 * - Course title display
 * - Proper z-index layering
 * - Border separator
 * 
 * @param title - The title of the current active course
 * @returns Sticky header with navigation and course title
 */
export const Header = ({ title }: Props) => {
    return (
        <div className="sticky top-0 bg-white pb-3 lg:pt-[28] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
            {/* Back to Courses Button */}
            <Link href="/courses">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400"/>
                </Button>
            </Link>
            
            {/* Course Title */}
            <h1 className="font-bold text-lg">
                {title}
            </h1>
            
            {/* Spacer for balanced layout */}
            <div />
        </div>
    );
};