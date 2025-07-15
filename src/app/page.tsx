
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="max-w-3xl">
            <Image
              src="/Fundees-Logo.png"
              alt="Fundees Logo"
              width={300}
              height={150}
              className="mx-auto mb-6"
              priority
            />
            <h1 className="text-4xl font-bold tracking-tight text-accent sm:text-5xl md:text-6xl font-headline">
              Welcome to Fundees
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80 sm:text-xl">
              A creative platform for young storytellers to spark their imagination.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
