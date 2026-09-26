import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForLocalDevelopmentOnly_12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nyaya-ai-dev.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nyaya-ai-dev",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nyaya-ai-dev.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Capture whether this is the FIRST initialization BEFORE calling initializeApp
// On HMR reloads, getApps().length > 0 so isNewApp = false — safe to use getAuth()
const isNewApp = !getApps().length;
const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

// On first load: use initializeAuth with localStorage persistence + popupRedirectResolver
// On HMR reload: app already exists, getAuth() returns the already-initialized auth instance
export const auth =
  isNewApp && typeof window !== "undefined"
    ? initializeAuth(app, {
        persistence: [browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      })
    : getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);


