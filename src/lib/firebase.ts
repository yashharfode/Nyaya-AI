import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized already (useful for Next.js hot reloading)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use browserLocalPersistence (localStorage) instead of indexedDB to prevent "Database is closing/hidden" HMR errors
let authInstance;
try {
  if (typeof window !== "undefined") {
    authInstance = initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence],
    });
  } else {
    authInstance = getAuth(app);
  }
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
