import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7Z3I9uisX2kWByCIPbOMyeCxV2naQ55c",
  authDomain: "prayerapp-34155.firebaseapp.com",
  projectId: "prayerapp-34155",
  storageBucket: "prayerapp-34155.firebasestorage.app",
  messagingSenderId: "973441033309",
  appId: "1:973441033309:web:62035d9dc9bc579f6b99b4",
  measurementId: "G-5B8FHJNEPY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Google provider with additional scopes and parameters
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

// Configure Apple provider with custom parameters
appleProvider.setCustomParameters({
  // Force the Apple sign-in to always prompt for user info
  prompt: 'select_account',
  // Request full name and email on first sign in
  locale: 'en',
  // Add any other parameters as needed
  auth_type: 'rerequest'
});

// Set persistence for auth state
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Auth persistence set to LOCAL');
  } catch (error) {
    console.error('Error setting auth persistence:', error);
  }
})();

// User data type
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  hasCompletedOnboarding: boolean;
  name?: string;
  denomination?: string;
  createdAt: any;
  updatedAt: any;
}

// Get user data from Firestore
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as UserData : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Create or update user data in Firestore
export const updateUserData = async (userId: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef, 
      { 
        ...data, 
        updatedAt: serverTimestamp() 
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Create a new user document in Firestore if it doesn't exist
export const createUserDocument = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  // Only create the document if it doesn't exist
  if (!userDoc.exists()) {
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || null,
      hasCompletedOnboarding: false,
      name: user.displayName || '',
      denomination: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, userData);
    return userData;
  }
  
  // If document exists, return the existing data
  return userDoc.data() as UserData;
};

export { 
  auth, 
  db,
  googleProvider, 
  appleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut as signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
};
