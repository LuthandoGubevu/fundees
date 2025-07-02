
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookHeart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/create-story", label: "Create Story" },
  { href: "/ask-ai", label: "Ask AI" },
  { href: "/library", label: "Library" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-foreground font-headline">
            Story Spark
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === href ? "text-primary" : "text-foreground/80"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button className="hidden md:inline-flex" asChild>
            <Link href="/create-story">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Creating
            </Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
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
                     <span className="font-bold text-xl text-foreground font-headline">Story Spark</span>
                  </Link>
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      className={cn(
                        "text-lg transition-colors hover:text-primary",
                        pathname === href ? "text-primary font-bold" : "text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
