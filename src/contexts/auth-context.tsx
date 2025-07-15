
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
      if (fbUser) {
        // User is signed in.
        try {
            const token = await fbUser.getIdToken();
            const res = await fetch('/api/auth/session-login', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('Session login failed');
            }
            
            setFirebaseUser(fbUser);
            const userProfile = await getUserById(fbUser.uid);
            setUser(userProfile);
        } catch (error) {
            console.error("Authentication process failed:", error);
            // If session login fails, ensure user is logged out of client state
            setUser(null);
            setFirebaseUser(null);
        }
      } else {
        // User is signed out.
        setUser(null);
        setFirebaseUser(null);
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
    
    if (!user && isProtectedRoute) {
      router.push('/login');
    }

  }, [isLoading, user, pathname, router]);


  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle the rest
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
    // We don't set loading to false here, onAuthStateChanged will do it.
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
