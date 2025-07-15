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
    <div className="relative container mx-auto px-4 py-16 text-center">
      <SunIcon />
      <div className="max-w-3xl mx-auto">
        <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h1 className="font-headline text-5xl md:text-7xl font-bold mt-4 text-foreground">
          Welcome to Fundees!
        </h1>
        <p className="mt-6 text-lg md:text-xl text-foreground/80">
          Your magical place to create amazing stories, get answers to your curious questions, and explore a library full of adventures written by friends like you!
        </p>
      </div>

      {isAuthenticated ? (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Pencil className="h-10 w-10" />}
            title="Create a Story"
            description="Let your imagination run wild! Write your own story with a little help from our AI friend."
            href="/create-story"
            buttonText="Start Writing"
            className="card-gradient text-white"
          />
          <FeatureCard
            icon={<HelpCircle className="h-10 w-10" />}
            title="Ask a Question"
            description="Curious about something? Ask our wise AI owl and get fun, kid-friendly answers."
            href="/ask-ai"
            buttonText="Ask Away"
            className="card-gradient-green text-white"
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10" />}
            title="Explore Library"
            description="Dive into a world of stories! Read amazing tales created by other young authors."
            href="/library"
            buttonText="Open Library"
            className="card-gradient text-white"
          />
        </div>
      ) : (
        <div className="mt-16">
          <Button asChild size="lg">
            <Link href="/login">Login to Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  className?: string;
}

function FeatureCard({ icon, title, description, href, buttonText, className }: FeatureCardProps) {
  return (
    <Card className={`flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-xl rounded-2xl ${className}`}>
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-white/20 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col text-center">
        <p className="flex-grow">{description}</p>
        <Button asChild size="lg" className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
