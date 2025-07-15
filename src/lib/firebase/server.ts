
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
        throw new Error("The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side authentication. Please add it to your .env.local file.");
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    if (getApps().length) {
        app = getApp();
    } else {
        app = initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app).bucket();

} catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Provide mock instances or throw error to prevent app from running without Firebase
    // For this case, we will throw to make it clear that setup is needed.
    throw new Error('Failed to initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT_KEY in .env.local. The value should be the full JSON object.');
}


export { app, auth, db, storage };
