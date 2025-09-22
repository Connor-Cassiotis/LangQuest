/**
 * Feed Wrapper Component
 * 
 * A layout component that provides consistent styling for main content areas.
 * This wrapper handles the main content container styling with proper spacing and positioning.
 */

type Props ={
    children: React.ReactNode;
};

/**
 * Wrapper component for main content feeds (lessons, courses, etc.)
 * 
 * @param children - React components to render inside the wrapper
 * @returns Styled container div with consistent layout properties
 */
export const FeedWrapper = ({children}:Props) => {
    return (
        <div className="flex-1 relative top-0 pb-10">
            {children}
        </div>
    );
}
