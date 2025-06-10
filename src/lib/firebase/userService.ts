import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import { FirebaseError } from './errors';

export interface UserProfile extends DocumentData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber?: string;
  providerData: any[];
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  // Custom fields
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
  // Timestamps
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

const USERS_COLLECTION = 'users';

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data() as UserProfile;
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Get a user profile by email
 */
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('email', '==', email.toLowerCase().trim())
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return querySnapshot.docs[0].data() as UserProfile;
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Create or update a user profile
 */
export async function setUserProfile(
  userId: string, 
  data: Partial<UserProfile>,
  options: { merge?: boolean } = { merge: true }
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const now = serverTimestamp();
    
    const userData = {
      ...data,
      updatedAt: now,
      ...(!data.createdAt && { createdAt: now }), // Only set on create
    };
    
    await setDoc(userRef, userData, { merge: options.merge });
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    if (!username || username.length < 3) {
      return false;
    }
    
    const q = query(
      collection(db, USERS_COLLECTION),
      where('username', '==', username.toLowerCase().trim())
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Get a user's public profile (stripped of sensitive data)
 */
export function getPublicUserProfile(user: UserProfile): Partial<UserProfile> {
  const { 
    uid, 
    displayName, 
    photoURL, 
    username, 
    bio, 
    website, 
    location,
    createdAt 
  } = user;
  
  return {
    uid,
    displayName,
    photoURL,
    username,
    bio,
    website,
    location,
    createdAt
  };
}

/**
 * Create a user profile from auth user data
 */
export function createUserProfileFromAuth(
  user: any,
  additionalData: Partial<UserProfile> = {}
): UserProfile {
  const now = new Date();
  
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    emailVerified: user.emailVerified || false,
    isAnonymous: user.isAnonymous || false,
    phoneNumber: user.phoneNumber || '',
    providerData: user.providerData || [],
    metadata: {
      creationTime: user.metadata?.creationTime || now.toISOString(),
      lastSignInTime: user.metadata?.lastSignInTime || now.toISOString(),
    },
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: true,
      },
    },
    ...additionalData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}
