import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  sendPasswordResetEmail as sendFirebasePasswordResetEmail,
  confirmPasswordReset as confirmFirebasePasswordReset,
  applyActionCode as firebaseApplyActionCode,
  checkActionCode as firebaseCheckActionCode,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  Auth,
  AuthError
} from 'firebase/auth';
import { auth } from './config';
import { FirebaseError } from './errors';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

/**
 * Signs in a user with email and password
 */
export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Signs up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Signs in with Google
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Signs in with Apple
 */
export async function signInWithApple(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Updates the user's profile
 */
export async function updateProfile(user: FirebaseUser, data: { displayName?: string; photoURL?: string }): Promise<void> {
  try {
    await updateFirebaseProfile(user, data);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Updates the user's email
 */
export async function updateEmail(user: FirebaseUser, newEmail: string): Promise<void> {
  try {
    await updateFirebaseEmail(user, newEmail);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Updates the user's password
 */
export async function updatePassword(user: FirebaseUser, newPassword: string): Promise<void> {
  try {
    await updateFirebasePassword(user, newPassword);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Sends a password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await sendFirebasePasswordResetEmail(auth, email);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Confirms a password reset
 */
export async function confirmPasswordReset(code: string, newPassword: string): Promise<void> {
  try {
    await confirmFirebasePasswordReset(auth, code, newPassword);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Verifies a password reset code
 */
export async function verifyPasswordResetCode(code: string): Promise<string> {
  try {
    return await firebaseVerifyPasswordResetCode(auth, code);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Applies an action code (email verification, password reset, etc.)
 */
export async function applyActionCode(code: string): Promise<void> {
  try {
    await firebaseApplyActionCode(auth, code);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Checks an action code (email verification, password reset, etc.)
 */
export async function checkActionCode(code: string): Promise<{
  data: {
    email?: string;
    previousEmail?: string;
    multiFactorInfo?: any;
  };
  operation: string;
}> {
  try {
    const info = await firebaseCheckActionCode(auth, code);
    return {
      data: {
        email: info.data.email ?? undefined,
        previousEmail: info.data.previousEmail ?? undefined,
        multiFactorInfo: info.data.multiFactorInfo,
      },
      operation: info.operation,
    };
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Gets the current user's ID token
 * @param forceRefresh - Whether to force refresh the token
 * @returns The current user's ID token
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    throw new FirebaseError(error as AuthError);
  }
}

/**
 * Gets the current user
 * @returns The current user or null if not authenticated
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Waits for the auth state to be initialized
 * @returns A promise that resolves when the auth state is initialized
 */
export function onAuthStateInitialized(auth: Auth): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
