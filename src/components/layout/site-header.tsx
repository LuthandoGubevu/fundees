
"use client";

import { useAuth } from "@/contexts/auth-context";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        {isAuthenticated && (
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        )}
      </div>
    </header>
  );
}
