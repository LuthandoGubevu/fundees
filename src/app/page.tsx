import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, HelpCircle, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";

const SunIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="absolute top-8 right-8 w-24 h-24 text-yellow-400 drop-shadow-lg"
    >
      <circle cx="50" cy="50" r="30" fill="currentColor" />
      <g transform="translate(50,50)">
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="35"
            y1="0"
            x2="45"
            y2="0"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
    </svg>
);


export default async function Home() {
  const user = await getAuthenticatedUser();
  const isAuthenticated = !!user;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-4 text-center">
      <SunIcon />
      <div className="max-w-3xl">
        <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h1 className="font-headline text-5xl md:text-7xl font-bold mt-4 text-foreground">
          Welcome to Fundees!
        </h1>
        <p className="mt-6 text-lg md:text-xl text-foreground/80">
          Your magical place to create amazing stories, get answers to your curious questions, and explore a library full of adventures written by friends like you!
        </p>
      </div>

      {isAuthenticated ? (
         <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
      ) : (
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/login">Login to Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
