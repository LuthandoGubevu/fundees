
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  if (process.env.NODE_ENV === 'production') {
    console.error("Firebase Admin SDK setup failed: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
  }
}

const serviceAccount = serviceAccountString 
  ? JSON.parse(serviceAccountString)
  : undefined;

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app).bucket();


export { app, auth, db, storage };
