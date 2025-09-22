/**
 * Main Application Layout
 * 
 * Layout component for the main authenticated sections of the app (learn, shop, quests, etc.).
 * Provides the sidebar navigation and responsive mobile header.
 */

import {Sidebar} from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

type Props ={
    children: React.ReactNode;
}

/**
 * Main layout for authenticated user pages
 * 
 * Features:
 * - Mobile header for small screens
 * - Desktop sidebar navigation (hidden on mobile)
 * - Responsive main content area with proper spacing
 * - Consistent max-width and centering for content
 * 
 * @param children - Page components (learn, shop, quests, leaderboard)
 * @returns Layout with navigation and main content area
 */
const MainLayout = ({children}:Props) => {
    return (
        <>
            {/* Mobile navigation header - shown only on small screens */}
            <MobileHeader />
            
            {/* Desktop sidebar navigation - hidden on mobile */}
            <Sidebar className="hidden lg:flex"/>
            
            {/* Main content area with responsive spacing */}
            <main className="lg:pl-[256] h-full pt-[50px] lg:pt-0">
                <div className="max-w-[1056px] mx-auto pt-6 h-full">
                    {children}
                </div>
            </main>
            
        </>
    );
};
export default MainLayout;