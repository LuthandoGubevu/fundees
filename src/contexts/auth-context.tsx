
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
const publicRoutes = ['/login', '/signup', '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthStateChanged = async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
            setFirebaseUser(fbUser);
            const userProfile = await getUserById(fbUser.uid);
            setUser(userProfile);
        } else {
            setFirebaseUser(null);
            setUser(null);
        }
        setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
      
      if (!user && isProtectedRoute) {
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/signup')) {
        router.push('/dashboard');
      }
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

  // Render a loader for initial auth check, or if navigating away from a protected route
  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

function FullPageLoader() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
