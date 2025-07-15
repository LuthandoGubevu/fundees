
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="h-screen w-full flex items-center justify-center bg-background/60 backdrop-blur-sm px-4">
        <div className="max-w-md w-full text-center space-y-6">
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
    </div>
  );
}
