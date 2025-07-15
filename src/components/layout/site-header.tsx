
"use client";

import { useAuth } from "@/contexts/auth-context";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { BookHeart } from "lucide-react";

export function SiteHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <BookHeart className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">Fundees</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
