
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Store the event
      setShowInstallPrompt(true); // Show custom button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

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
            
            <p className="mt-6 text-lg leading-8 text-foreground/80 sm:text-xl">
              A creative platform for young storytellers to spark their imagination.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
             {showInstallPrompt && (
                <button onClick={handleInstallClick} className="install-button">
                Install Fundees App
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
