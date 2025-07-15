
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="h-screen w-full flex items-center justify-center bg-background/60 backdrop-blur-sm px-4">
        <div className="max-w-md w-full text-center space-y-6 flex flex-col items-center">
          <Image
            src="/Fundees-Logo.png"
            alt="Fundees Logo"
            width={300}
            height={150}
            priority
          />
          
          <Button asChild size="lg" className="px-6 py-3">
            <Link href="/dashboard">Get Started For Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
