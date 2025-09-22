/**
 * Landing Page Footer Component
 * 
 * Footer component displaying available language courses with flag icons.
 * Shows popular languages to give users a preview of what's available in LangQuest.
 */

import Image from "next/image";
import { Button } from "@/components/ui/button";

/**
 * Footer component showcasing available languages
 * 
 * Features:
 * - Only visible on large screens (hidden on mobile)
 * - Displays 5 popular languages with flag icons
 * - Clickable buttons for each language
 * - Responsive layout with proper spacing
 * 
 * @returns Footer with language selection buttons
 */
export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                {/* Croatian Language Option */}
                <Button size="lg" variant="ghost">
                    <Image 
                    src="/hr.svg" 
                    alt="Croatian" 
                    height={32} 
                    width={40}
                    className="mr-4 rounded-md"
                    />
                    Croatian
                </Button>
                
                {/* Spanish Language Option */}
                <Button size="lg" variant="ghost">
                    <Image 
                    src="/es.svg" 
                    alt="Spanish" 
                    height={32} 
                    width={40}
                    className="mr-4 rounded-md"
                    />
                    Spanish
                </Button>
                
                {/* French Language Option */}
                <Button size="lg" variant="ghost">
                    <Image 
                    src="/fr.svg" 
                    alt="French" 
                    height={32} 
                    width={40}
                    className="mr-4 rounded-md"
                    />
                    French
                </Button>
                
                {/* Italian Language Option */}
                <Button size="lg" variant="ghost">
                    <Image 
                    src="/it.svg" 
                    alt="Italian" 
                    height={32} 
                    width={40}
                    className="mr-4 rounded-md"
                    />
                    Italian
                </Button>
                
                {/* Japanese Language Option */}
                <Button size="lg" variant="ghost">
                    <Image 
                    src="/jp.svg" 
                    alt="Japanese" 
                    height={32} 
                    width={40}
                    className="mr-4 rounded-md"
                    />
                    Japanese
                </Button>
            </div>
        </footer>
    );
};