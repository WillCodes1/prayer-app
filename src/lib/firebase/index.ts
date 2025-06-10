// Core Firebase exports
export * from './config';

// Authentication
export * from './auth';

// Firestore
export * from './firestore';

// Services
export * from './userService';

// Error handling
export * from './errors';

// Types
export type { 
  User as FirebaseUser,
  UserCredential,
  AuthError
} from 'firebase/auth';

export type { 
  DocumentData, 
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  CollectionReference,
  DocumentReference,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore';

// Re-export commonly used Firebase modules
export { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  getDocs,
  onSnapshot,
  writeBatch,
  runTransaction
} from 'firebase/firestore';

export {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
  checkActionCode,
  updateProfile as updateAuthProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged
} from 'firebase/auth';
