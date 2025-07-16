'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstallPrompt } from '@/components/install-prompt';

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
        <InstallPrompt />
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
              A creative platform for young storytellers to spark their
              imagination.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <button className="rounded-full bg-yellow-400 px-6 py-3 text-lg font-bold shadow-lg transition hover:bg-yellow-300">
                  Get Started For Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
