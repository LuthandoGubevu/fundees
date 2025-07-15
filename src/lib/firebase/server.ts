
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount!),
    });

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
