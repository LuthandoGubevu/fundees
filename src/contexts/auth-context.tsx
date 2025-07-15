
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { FullPageLoader } from '@/components/ui/full-page-loader';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard', '/create-story', '/ask-ai', '/library', '/story'];
const publicRoutes = ['/login', '/signup'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
             // Handle case where user exists in auth but not firestore
            setUser({ id: firebaseUser.uid, email: firebaseUser.email } as User);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUser(null); // Clear user on error
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return; // Don't do anything while loading
    }
    
    const isAuthenticated = !!user;
    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
    } else if (isAuthenticated && (isPublicRoute || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle setting user to null
    router.push('/login');
  };
  
  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
