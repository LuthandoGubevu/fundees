
import { initializeApp, getApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app: App;
let auth: Auth;
let db: Firestore;
let storage: ReturnType<Storage['bucket']>;

try {
  if (!serviceAccountString) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in the environment variables. Server-side Firebase features will not work.");
  }

  const serviceAccount = JSON.parse(serviceAccountString);

  app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app).bucket();

} catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Firebase Admin SDK initialization failed:', error.message);
        console.warn('This is expected if you have not set up server-side credentials in your .env.local file. Certain server-side Firebase features will not be available.');
    } else if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: Firebase Admin SDK initialization failed in production.', error);
    }
    // Set to dummy objects to avoid breaking imports in environments without server credentials.
    // @ts-ignore
    app = {};
    // @ts-ignore
    auth = {};
    // @ts-ignore
    db = {};
    // @ts-ignore
    storage = {};
}


export { app, auth, db, storage };
