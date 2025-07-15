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

const protectedRoutes = ['/create-story', '/ask-ai', '/dashboard'];

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
        // The user profile might not be created immediately after sign up
        // We set the user only if the profile exists.
        // The signup page is responsible for creating the user document.
        if (userProfile) {
          setUser(userProfile);
        }
        // If profile doesn't exist, we wait. The user will be in a "logged out"
        // state until their profile is created, at which point onAuthStateChanged
        // or a subsequent check will pick them up.
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
    if (isLoading) return; // Wait until the user state is loaded

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
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
