
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const protectedRoutes = ['/dashboard', '/create-story', '/ask-ai', '/library', '/story'];
const publicRoutes = ['/', '/login', '/signup'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const token = await fbUser.getIdToken();
        const userProfile = await getUserById(fbUser.uid);
        setUser(userProfile);
        
        try {
          await fetch('/api/auth/session-login', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (error) {
            console.error("Failed to sync server session:", error);
        }

      } else {
        setFirebaseUser(null);
        setUser(null);
        try {
            await fetch('/api/auth/session-logout', { method: 'POST' });
        } catch (error) {
            console.error("Failed to clear server session:", error);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/login');
    }

  }, [isLoading, user, pathname, router]);


  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const isAuthenticated = !isLoading && !!user;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, logout, isAuthenticated, isLoading }}>
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
