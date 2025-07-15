
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Library, LogOut, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const navLinksLeft = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
];

const navLinksRight = [
  { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
];

const createLink = { href: '/create-story' };

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex justify-around items-center h-full">
        {navLinksLeft.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              pathname === link.href ? "text-accent" : "text-muted-foreground hover:text-accent"
            )}
          >
            <link.icon className="h-6 w-6 mb-1" />
            <span>{link.label}</span>
          </Link>
        ))}

        <Link
          href={createLink.href}
          className={cn(
            "flex flex-col items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground -mt-8 shadow-lg text-xs font-medium",
            pathname === createLink.href ? "ring-2 ring-white" : ""
          )}
        >
          <Wand2 className="h-8 w-8" />
          <span className="mt-1">Create</span>
        </Link>

        {navLinksRight.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              pathname === link.href ? "text-accent" : "text-muted-foreground hover:text-accent"
            )}
          >
            <link.icon className="h-6 w-6 mb-1" />
            <span>{link.label}</span>
          </Link>
        ))}
         <button
            onClick={logout}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors text-muted-foreground hover:text-accent"
            )}
          >
            <LogOut className="h-6 w-6 mb-1" />
            <span>Logout</span>
          </button>
      </div>
    </nav>
  );
}
