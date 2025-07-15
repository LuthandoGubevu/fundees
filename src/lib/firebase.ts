// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtbdw52IZ4sji35udBsomaoboI0rEzwTc",
  authDomain: "fundees.firebaseapp.com",
  projectId: "fundees",
  storageBucket: "fundees.appspot.com",
  messagingSenderId: "233053582894",
  appId: "1:233053582894:web:af7e815ccc3caacc50d1bf"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
