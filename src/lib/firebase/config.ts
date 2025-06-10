import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0 && import.meta.env.VITE_APP_ENV !== 'test') {
  console.error(
    'Missing required Firebase environment variables:',
    missingEnvVars.join(', ')
  );
  throw new Error('Missing required Firebase environment variables');
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase only once
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable Firestore offline persistence
  // enableIndexedDbPersistence(db).catch((err) => {
  //   if (err.code === 'failed-precondition') {
  //     console.warn(
  //       'When multiple tabs open, Firestore persistence can only be enabled in one tab at a time.'
  //     );
  //   } else if (err.code === 'unimplemented') {
  //     console.warn(
  //       'The current browser does not support all of the features required to enable Firestore persistence.'
  //     );
  //   }
  // });
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
