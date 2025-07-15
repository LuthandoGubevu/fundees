import { auth } from '@/lib/firebase/server';
import { getUserById } from '@/lib/firestore';
import { cookies } from 'next/headers';
import type { User } from './types';

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const user = await getUserById(decodedToken.uid);
    return user;
  } catch (error) {
    // Session cookie is invalid or expired.
    // console.error("Auth error:", error);
    return null;
  }
}
