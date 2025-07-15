
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        
        <div className="flex justify-center items-center space-x-4">
            <Image src="/fundee-1.jpg" alt="A friendly and welcoming character" width={150} height={150} className="rounded-full shadow-lg" />
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
