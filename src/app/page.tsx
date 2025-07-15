
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const SunIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
);


export default async function Home() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        
        <div className="flex justify-center items-center space-x-4">
            <Sparkles className="w-12 h-12 text-primary" />
            <SunIcon className="w-12 h-12 text-yellow-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
          Welcome to Fundees!
        </h1>
        
        <p className="text-base md:text-lg text-foreground/80">
          Your magical place to create amazing stories, get answers to your curious questions, and explore a library full of adventures written by friends like you!
        </p>

        <Button asChild size="lg" className="px-6 py-3">
          <Link href="/dashboard">Get Started For Free</Link>
        </Button>
      </div>
    </div>
  );
}
