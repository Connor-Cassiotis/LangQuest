/**
 * Marketing/Landing Page Layout
 * 
 * Layout component for public-facing pages like the homepage and marketing content.
 * Provides a clean layout with header and footer for unauthenticated users.
 */

import { Footer } from "./footer";
import { Header } from "./header";

type Props ={
    children: React.ReactNode;
}

/**
 * Marketing layout for landing pages and public content
 * 
 * Features:
 * - Header with logo and authentication buttons
 * - Centered main content area
 * - Footer with additional information
 * - Full-height layout with proper flex distribution
 * 
 * @param children - Landing page content components
 * @returns Marketing layout with header and footer
 */
const MarketingLayout = ({children}:Props) => {
  return (
  <div className="min-h-screen flex flex-col">
    {/* Header with navigation and auth buttons */}
    <Header />
    
    {/* Main content area - centered and flexible */}
    <main className="flex-1 flex flex-col items-center justify-center"> 
        {children}
    </main>
    
    {/* Footer with additional information */}
    <Footer />
    </div>)
}
export default MarketingLayout;