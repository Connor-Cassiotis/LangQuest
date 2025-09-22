/**
 * Sticky Wrapper Component
 * 
 * A layout component that creates a sticky sidebar on larger screens.
 * This wrapper is used for secondary content like user progress, quests, or promotional content.
 */

type Props ={
    children: React.ReactNode;
};

/**
 * Sticky positioning wrapper for sidebar content
 * 
 * Features:
 * - Hidden on mobile/tablet (lg:block)
 * - Fixed width for consistent layout
 * - Sticky positioning that follows scroll
 * - Full height container with proper spacing
 * 
 * @param children - React components to render in the sticky sidebar
 * @returns Sticky positioned container (desktop only)
 */
export const StickyWrapper = ({children}:Props) => {
    return (
        <div className="hidden lg:block w-[368px] sticky self-end bottom-6">
            <div className="min-h-[calc(100vh-48px)] sticky top-6 flex flex-col gap-y-4">
                {children}
            </div>
        </div>
    );
}