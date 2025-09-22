/**
 * Landing Page Component
 * 
 * The main homepage for LangQuest that welcomes new users and provides authentication options.
 * Displays hero content and conditional authentication buttons based on user status.
 */

import { Button } from "@/components/ui/button";
import {ClerkLoading, ClerkLoaded, SignedOut, SignedIn, SignUpButton,SignInButton } from '@clerk/nextjs'
import Image from "next/image";
import { Loader } from "lucide-react";
import Link from "next/link";

/**
 * Homepage component with hero section and authentication
 * 
 * Features:
 * - Hero image and compelling copy
 * - Responsive design (mobile and desktop layouts)
 * - Conditional authentication buttons based on user state
 * - Loading states for authentication
 * - Different CTAs for signed in/out users
 * 
 * @returns Landing page with hero content and auth options
 */
export default function Home() {
 return (
  <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
    {/* Hero Image - responsive sizing */}
    <div className ="relative w-[240px] h-[240px] lg:w-[424px} lg:h-[424px] mb-8 lg:mb-0">
      <Image  src="/hero.svg" fill alt="Hero" />
    </div>
    
    {/* Hero Content and CTAs */}
    <div className="flex flex-col items-center gap-y-8">
      {/* Main headline */}
      <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
        Learn, pratice, and master new languages with Lingo.
      </h1>
      
      {/* Authentication buttons with loading states */}
      <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
         {/* Loading state while authentication loads */}
         <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
         </ClerkLoading>
         
         {/* Authentication buttons when loaded */}
         <ClerkLoaded>
            {/* Buttons for users not signed in */}
            <SignedOut>
              <SignUpButton
                mode="modal"
              >
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
              >
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            
            {/* Button for signed in users */}
            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                Continue Learning 
                </Link>
              </Button>
            </SignedIn>
         </ClerkLoaded>
      </div>
    </div>
  </div>
 )
}
