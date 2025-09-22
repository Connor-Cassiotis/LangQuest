/**
 * Sidebar Item Component
 * 
 * Individual navigation item for the sidebar with active state styling.
 * Displays an icon and label, with different styling for the currently active page.
 */

"use client";
import {Button} from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Props ={
    label: string; // Display text for the navigation item
    iconSrc : string; // Path to the icon image
    href: string; // Destination URL

};

/**
 * Navigation item component for sidebar
 * 
 * Features:
 * - Active state detection using pathname
 * - Different button variants for active/inactive states
 * - Icon and text layout
 * - Full-width clickable area
 * 
 * @param label - Text to display for the navigation item
 * @param iconSrc - Path to the icon image file
 * @param href - URL to navigate to when clicked
 * @returns Button component styled as navigation item
 */
export const SidebarItem = ({
    label,
    iconSrc,
    href
}:Props) => {
    // Get current pathname to determine active state
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Button variant={active ? "sidebarOutline" : "sidebar"} className="justify-start h-[52px]" asChild>
            <Link href={href}>
                <Image src={iconSrc} alt={label} className="mr-5" height={32} width={32}/>
                {label}
            </Link>
        </Button>
    );
};