
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Library, UserCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const navLinksLeft = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
];

const navLinksRight = [
  { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
  { href: '/dashboard', label: 'Profile', icon: UserCircle },
];

const createLink = { href: '/create-story' };

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

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
              pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <link.icon className="h-6 w-6 mb-1" />
            <span>{link.label}</span>
          </Link>
        ))}

        <Link
          href={createLink.href}
          className={cn(
            "flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white -mt-8 shadow-lg",
            pathname === createLink.href ? "ring-2 ring-white" : ""
          )}
        >
          <Plus className="h-8 w-8" />
          <span className="sr-only">Create Story</span>
        </Link>

        {navLinksRight.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              pathname === link.href && link.label !== 'Profile' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <link.icon className="h-6 w-6 mb-1" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
