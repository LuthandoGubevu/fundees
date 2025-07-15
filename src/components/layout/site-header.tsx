
"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, Pencil, Sparkles, Library, UserCircle, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/create-story', label: 'Create Story', icon: Pencil },
  { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
  { href: '/library', label: 'Library', icon: Library },
];

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Fundees Logo" width={100} height={40} />
          </Link>
        </div>

        {isAuthenticated && (
          <>
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground">{user?.firstName}</span>
              <UserCircle className="h-6 w-6 text-muted-foreground" />
               <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                  <LogOut className="h-5 w-5"/>
               </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
