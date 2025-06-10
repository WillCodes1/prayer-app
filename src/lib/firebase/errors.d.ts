declare module '@/lib/firebase/errors' {
  /**
   * Maps Firebase Auth and Firestore error codes to user-friendly error messages
   * @param error The error object from Firebase
   * @returns A user-friendly error message
   */
  export function getFirebaseErrorMessage(error: any): string;

  /**
   * Checks if an error is a Firebase Auth error
   * @param error The error object to check
   * @returns True if the error is a Firebase Auth error
   */
  export function isFirebaseAuthError(error: any): boolean;

  /**
   * Checks if an error is a Firestore error
   * @param error The error object to check
   * @returns True if the error is a Firestore error
   */
  export function isFirestoreError(error: any): boolean;

  /**
   * Logs an error with appropriate context
   * @param error The error to log
   * @param context Optional context for the error
   * @returns The error message that was logged
   */
  export function logError(error: any, context?: string): string;
}
