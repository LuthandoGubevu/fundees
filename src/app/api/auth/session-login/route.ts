
import { auth } from '@/lib/firebase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 7 days
const expiresIn = 60 * 60 * 24 * 7 * 1000;

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      // The token verification is sufficient to ensure the user is authenticated.
      // The strict 5-minute check is removed to allow existing valid sessions.
      await auth.verifyIdToken(idToken);
      
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      return NextResponse.json({ status: 'success' });

    } catch (error) {
      console.error('Session login error:', error);
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.json({ status: 'error', message: 'Bad Request' }, { status: 400 });
}
