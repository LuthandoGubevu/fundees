
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookHeart, Sparkles, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/create-story", label: "Create Story" },
  { href: "/ask-ai", label: "Ask AI" },
  { href: "/library", label: "Library" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-foreground font-headline">
            Fundees
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => {
            const isProtected = href === '/create-story' || href === '/ask-ai';
            const finalHref = isProtected && !isLoading && !isAuthenticated ? '/login' : href;
            
            return (
                <Link
                key={label}
                href={finalHref}
                className={cn(
                    "transition-colors hover:text-primary",
                    pathname === href ? "text-primary" : "text-foreground/80"
                )}
                >
                {label}
                </Link>
            )
          })}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoading ? (
             <div className="hidden md:flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
             </div>
          ) : (
             <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated && user ? (
                  <>
                     <Button variant="ghost" asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                           <UserCircle className="h-5 w-5" />
                           <span>{user.firstName}</span>
                        </Link>
                     </Button>
                     <Button variant="outline" onClick={logout} size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                     </Button>
                  </>
               ) : (
                  <>
                     <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                     </Button>
                     <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                     </Button>
                  </>
               )}
            </div>
          )}
          
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="mr-6 flex items-center space-x-2 mb-4">
                     <BookHeart className="h-8 w-8 text-primary" />
                     <span className="font-bold text-xl text-foreground font-headline">Fundees</span>
                  </Link>
                  {navLinks.map(({ href, label }) => {
                    const isProtected = href === '/create-story' || href === '/ask-ai';
                    const finalHref = isProtected && !isLoading && !isAuthenticated ? '/login' : href;

                    return (
                        <Link
                        key={label}
                        href={finalHref}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                            "text-lg transition-colors hover:text-primary",
                            pathname === href ? "text-primary font-bold" : "text-foreground"
                        )}
                        >
                        {label}
                        </Link>
                    )
                  })}
                  <div className="border-t pt-4 space-y-2">
                    {isLoading ? <Skeleton className="h-10 w-full" /> : (
                       isAuthenticated && user ? (
                           <>
                                <Button variant="ghost" asChild className="w-full justify-start text-lg">
                                    <Link href="/dashboard" onClick={() => setIsSheetOpen(false)}>
                                        <UserCircle className="mr-2 h-5 w-5" />
                                        {user.firstName}'s Dashboard
                                    </Link>
                                </Button>
                                <Button variant="outline" onClick={() => { logout(); setIsSheetOpen(false); }} className="w-full justify-start text-lg">
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Logout
                                </Button>
                           </>
                       ) : (
                           <>
                                <Button asChild className="w-full text-lg">
                                    <Link href="/login" onClick={() => setIsSheetOpen(false)}>Login</Link>
                                </Button>
                                <Button asChild variant="secondary" className="w-full text-lg">
                                    <Link href="/signup" onClick={() => setIsSheetOpen(false)}>Sign Up</Link>
                                </Button>
                           </>
                       )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
