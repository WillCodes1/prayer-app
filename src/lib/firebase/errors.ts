/**
 * Custom error class for Firebase-related errors
 */
export class FirebaseError extends Error {
  public readonly code: string;
  public readonly originalError: unknown;

  constructor(error: unknown) {
    super();
    this.name = 'FirebaseError';
    this.originalError = error;
    
    if (error instanceof Error) {
      this.message = error.message;
      this.stack = error.stack;
      
      // @ts-ignore - Firebase Auth errors have a code property
      this.code = error.code || 'unknown';
    } else if (typeof error === 'string') {
      this.message = error;
      this.code = 'unknown';
    } else {
      this.message = 'An unknown error occurred';
      this.code = 'unknown';
    }
    
    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, FirebaseError.prototype);
  }
  
  /**
   * Check if the error is a specific Firebase error
   */
  is(code: string): boolean {
    return this.code === code;
  }
  
  /**
   * Get the user-friendly error message
   */
  getFriendlyMessage(): string {
    return getFirebaseErrorMessage(this);
  }
}

/**
 * Maps Firebase Auth error codes to user-friendly error messages
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  
  // Extract code and message from error object
  const errorInfo = {
    code: '',
    message: ''
  };
  
  if (error instanceof FirebaseError) {
    errorInfo.code = error.code;
    errorInfo.message = error.message;
  } else if (error && typeof error === 'object') {
    // Handle error-like objects
    const errorObj = error as Record<string, unknown>;
    
    // Extract code if it exists
    if ('code' in errorObj) {
      errorInfo.code = String(errorObj.code);
    }
    
    // Safely extract message from error object
    if ('message' in errorObj) {
      errorInfo.message = String(errorObj.message);
    } else if (error instanceof Error) {
      errorInfo.message = error.message;
    } else {
      errorInfo.message = 'An unknown error occurred';
    }
  } else if (error instanceof Error) {
    errorInfo.message = error.message;
  } else if (typeof error === 'string') {
    errorInfo.message = error;
  }
  
  // Handle Firebase Auth errors
  const errorCode = errorInfo.code;
  switch (errorCode) {
    // Common auth errors
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials';
    case 'auth/requires-recent-login':
      return 'Please sign in again to update your email';
    case 'auth/provider-already-linked':
      return 'This account is already linked to your profile';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with another user';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Contact support';
    case 'auth/invalid-credential':
      return 'The provided credential is invalid or has expired';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again';
    case 'auth/popup-closed-by-user':
      return 'Sign in was canceled';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups and try again';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for authentication';
    case 'auth/operation-not-supported-in-this-environment':
      return 'This operation is not supported in this environment';
    case 'auth/timeout':
      return 'The operation timed out. Please try again';
    case 'auth/web-storage-unsupported':
      return 'Your browser does not support web storage. Please enable it to continue';
    
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to perform this action';
    case 'not-found':
      return 'The requested document was not found';
    case 'already-exists':
      return 'A document with the same ID already exists';
    case 'resource-exhausted':
      return 'The request was rate limited. Please try again later';
    case 'failed-precondition':
      return 'The operation was rejected because the system is not in a required state';
    case 'aborted':
      return 'The operation was aborted';
    case 'out-of-range':
      return 'The operation was attempted past the valid range';
    case 'unimplemented':
      return 'The operation is not implemented or not supported/enabled';
    case 'internal':
      return 'An internal error occurred';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later';
    case 'data-loss':
      return 'Unrecoverable data loss or corruption occurred';
    case 'unauthenticated':
      return 'You must be authenticated to perform this action';
    
    // Generic error handling
    default:
      console.error('Unhandled error:', error);
      return errorInfo.message || 'An unexpected error occurred. Please try again';
  }
}

/**
 * Checks if an error is a Firebase Auth error
 */
interface ErrorWithCode {
  code: string;
  message?: string;
  [key: string]: unknown;
}

export function isFirebaseAuthError(error: unknown): error is ErrorWithCode {
  if (!error || typeof error !== 'object') return false;
  
  const errorWithCode = error as { code?: unknown };
  return (
    'code' in errorWithCode && 
    typeof errorWithCode.code === 'string' && 
    errorWithCode.code.startsWith('auth/')
  );
}

/**
 * Checks if an error is a Firestore error
 */
const FIRESTORE_ERROR_CODES = [
  'permission-denied',
  'not-found',
  'already-exists',
  'resource-exhausted',
  'failed-precondition',
  'aborted',
  'out-of-range',
  'unimplemented',
  'internal',
  'unavailable',
  'data-loss',
  'unauthenticated',
] as const;

export function isFirestoreError(error: unknown): error is ErrorWithCode {
  if (!error || typeof error !== 'object') return false;
  
  const errorWithCode = error as { code?: unknown };
  return (
    'code' in errorWithCode &&
    typeof errorWithCode.code === 'string' &&
    (FIRESTORE_ERROR_CODES as readonly string[]).includes(errorWithCode.code)
  );
}

/**
 * Logs an error with appropriate context
 * @returns The error message that was logged
 */
export function logError(error: unknown, context: string = ''): string {
  const errorMessage = getFirebaseErrorMessage(error);
  const errorContext = context ? `[${context}] ` : '';
  
  if (error instanceof FirebaseError) {
    console.error(`${errorContext}${errorMessage}`, error.originalError);
  } else {
    console.error(`${errorContext}${errorMessage}`, error);
  }
  
  return errorMessage;
}

/**
 * Creates a FirebaseError from any error-like object
 */
export function createFirebaseError(error: unknown): FirebaseError {
  return error instanceof FirebaseError ? error : new FirebaseError(error);
}

/**
 * Asserts that a condition is true, otherwise throws a FirebaseError
 * @throws {FirebaseError} If the condition is false
 */
export function assert(condition: unknown, message: string, errorCode: string = 'assertion-failed'): asserts condition {
  if (!condition) {
    const error = new Error(message);
    // Add code property
    (error as any).code = errorCode;
    throw new FirebaseError(error);
  }
}

/**
 * Asserts that a value is not null or undefined, otherwise throws a FirebaseError
 * @throws {FirebaseError} If the value is null or undefined
 */
export function assertDefined<T>(
  value: T | null | undefined, 
  message: string = 'Value is required', 
  errorCode: string = 'value-required'
): asserts value is T {
  assert(value !== null && value !== undefined, message, errorCode);
}
