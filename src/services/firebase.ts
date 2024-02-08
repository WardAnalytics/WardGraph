// Import the functions you need from the SDKs you need
import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID: appId,
  VITE_FIREBASE_MEASUREMENT_ID: measurementId,
} = import.meta.env;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const analytics: Analytics = getAnalytics(app);
const db: Firestore = getFirestore(app);

if (import.meta.env.MODE === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

auth.useDeviceLanguage();

const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, googleProvider };
