
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (e) {
    console.error('Firebase Admin Init Error in session-login route:', e);
  }
}

const auth = getAuth();

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
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
