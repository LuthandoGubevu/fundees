
'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };


  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="h-screen w-full flex items-center justify-center bg-background/60 backdrop-blur-sm px-12">
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

          {showInstallPrompt && (
            <button onClick={handleInstallClick} className="install-button">
              Install Fundees App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
