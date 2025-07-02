'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const protectedRoutes = ['/create-story', '/ask-ai', '/dashboard'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs once on mount to load the user from local storage.
    try {
      const storedUser = localStorage.getItem('fundees-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Could not parse user from localStorage", error)
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    const { password, ...userToStore } = userData; // Never store password in state or storage
    setUser(userToStore);
     try {
      localStorage.setItem('fundees-user', JSON.stringify(userToStore));
    } catch (error) {
        console.error("Could not save user to localStorage", error)
    }
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    try {
        localStorage.removeItem('fundees-user');
    } catch (error) {
        console.error("Could not remove user from localStorage", error)
    }
    router.push('/');
  }, [router]);

  const isAuthenticated = !!user;

  // This effect handles route protection.
  useEffect(() => {
    if (isLoading) return; // Wait until the user state is loaded

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
