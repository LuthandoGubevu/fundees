
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const protectedRoutes = ['/dashboard', '/create-story', '/ask-ai', '/library', '/story'];
const publicRoutes = ['/login', '/signup'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userProfile = await getUserById(fbUser.uid);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthenticated = !!user;

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
    }
    
    if (isAuthenticated && isPublicRoute) {
      router.push('/dashboard');
    }

  }, [isLoading, user, pathname, router]);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const isAuthenticated = !isLoading && !!user;

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
