/**
 * Learn Page Loading Component
 * 
 * Loading state component displayed while the learn page data is being fetched.
 * Shows a centered spinner animation.
 */

import { Loader } from "lucide-react";

/**
 * Loading component for the learn page
 * 
 * Features:
 * - Full screen centered layout
 * - Animated spinner icon
 * - Proper accessibility with muted foreground color
 * 
 * @returns Centered loading spinner
 */
const Loading = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
    );
};

export default Loading;