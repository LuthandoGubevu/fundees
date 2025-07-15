
import { initializeApp, getApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in the environment variables. This is required for server-side authentication.");
}

const serviceAccount = JSON.parse(serviceAccountString);

const app: App = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: ReturnType<Storage['bucket']> = getStorage(app).bucket();

export { app, auth, db, storage };
