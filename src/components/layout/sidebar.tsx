'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';
import { BookHeart, Home, Pencil, Sparkles, Library, LogOut, UserCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/create-story', label: 'Create Story', icon: Pencil },
  { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
  { href: '/library', label: 'Library', icon: Library },
];

export function Sidebar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null; // Don't render sidebar if not logged in
  }

  return (
    <SidebarPrimitive side="left" collapsible="icon" className="hidden md:flex">
      <SidebarContent>
        <SidebarHeader>
            <SidebarTrigger>
                <BookHeart />
            </SidebarTrigger>
        </SidebarHeader>

        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.label}>
              <Link href={link.href}>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={{
                    children: link.label,
                  }}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? (
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : user ? (
            <>
                <Link href="/dashboard">
                    <SidebarMenuButton tooltip={{children: `${user.firstName}'s Profile`}}>
                        <UserCircle />
                        <span>{user.firstName}</span>
                    </SidebarMenuButton>
                </Link>
                <SidebarMenuButton onClick={logout} tooltip={{children: "Logout"}}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </>
        ) : (
          <Link href="/login">
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
