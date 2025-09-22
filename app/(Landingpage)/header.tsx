/**
 * Landing Page Header Component
 * 
 * Header component for the marketing/landing pages with LangQuest branding
 * and authentication controls. Shows different content based on user authentication status.
 */

import Image from "next/image";
import { Loader } from "lucide-react";
import { ClerkLoaded, ClerkLoading,SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Header component for landing pages
 * 
 * Features:
 * - LangQuest logo and branding
 * - Responsive layout with proper spacing
 * - Authentication state handling with loading states
 * - User button for signed in users
 * - Login button for signed out users
 * 
 * @returns Header component with logo and authentication controls
 */
export const Header = () => {
    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                {/* Logo and Brand Name */}
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3"><Image src="/LangQuest-Logo.svg" height={40} width={40} alt="Mascot" /> 
                    <h1 className ="text-2xl font-extrabold text-green-600 tracking-wide">
                        LangQuest
                    </h1>
                </div>
                
                {/* Authentication Loading State */}
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                
                {/* Authentication Controls */}
                <ClerkLoaded>
                    {/* User button for authenticated users */}
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </SignedIn>
                    
                    {/* Login button for unauthenticated users */}
                    <SignedOut>
                        <SignInButton
                           mode="modal">
                            <Button size="lg" variant="ghost">
                                Login
                            </Button>
                        </SignInButton> 
                    </SignedOut>      
                </ClerkLoaded>
                
            </div>
        </header>
    );
};