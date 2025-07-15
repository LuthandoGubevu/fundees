
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const protectedRoutes = ['/create-story', '/ask-ai', '/dashboard', '/library', '/story'];
const authRoutes = ['/login', '/signup'];

function FullPageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
            const userProfile = await getUserById(firebaseUser.uid);
            setUser(userProfile);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(() => {
    signOut(auth).then(() => {
      router.push('/');
    });
  }, [router]);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
    }

    if (isAuthenticated && isAuthRoute) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  const contextValue = { user, logout, isAuthenticated, isLoading };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
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
