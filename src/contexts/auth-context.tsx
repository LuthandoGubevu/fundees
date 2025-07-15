'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const protectedRoutes = ['/create-story', '/ask-ai', '/dashboard', '/library'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, fetch profile from Firestore
        const userProfile = await getUserById(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
        } else {
          // If profile doesn't exist yet, it might be a new sign-up.
          // Keep user as null for now. Firestore trigger or subsequent action will populate it.
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = useCallback(() => {
    signOut(auth).then(() => {
      router.push('/');
    });
  }, [router]);

  const isAuthenticated = !!user;

  // This effect handles route protection.
  useEffect(() => {
    // Wait until the initial loading is complete before enforcing routes.
    if (isLoading) {
      return; 
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
    }

    if (isAuthenticated && isAuthRoute) {
      router.push('/dashboard');
    }

  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, logout, isAuthenticated, isLoading }}>
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
