
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pencil, Sparkles, Library, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/create-story', label: 'Create', icon: Pencil },
  { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/dashboard', label: 'Profile', icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex justify-around items-center h-full">
        {navLinks.map((link) => (
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
      </div>
    </nav>
  );
}
