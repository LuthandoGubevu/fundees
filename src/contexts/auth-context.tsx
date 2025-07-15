
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUser: User = {
    id: '1',
    firstName: 'Amina',
    lastName: 'Chike',
    email: 'amina@school.com',
    school: 'Sunshine Primary',
    grade: '3rd Grade',
    totalLikes: 42,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(mockUser);
  const isLoading = false; // Always false as we are not fetching anything
  const isAuthenticated = true; // Always true

  const logout = () => {
    // In a real app, this would clear the user session.
    // For now, it does nothing as auth is disabled.
    console.log("Logout function called, but authentication is disabled.");
  };

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
