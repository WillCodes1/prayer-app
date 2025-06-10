import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

/**
 * Custom hook to listen to Firebase auth state changes
 * @returns The current user and loading state
 */
export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return { currentUser, loading, error };
}

/**
 * Higher-order component to provide auth state to a component
 * @param Component The component to wrap with auth state
 * @returns A new component with auth state props
 */
export function withAuthState<P extends object>(
  Component: React.ComponentType<P & { currentUser: User | null; loading: boolean }>
) {
  const WrappedComponent = (props: P) => {
    const { currentUser, loading } = useAuthState();
    return <Component {...props} currentUser={currentUser} loading={loading} />;
  };
  
  // Set a display name for the component for better debugging
  const componentName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withAuthState(${componentName})`;
  
  return WrappedComponent;
}

/**
 * Hook to check if the current user has a specific role
 * @param requiredRole The role to check for
 * @returns Object with hasRole boolean and loading state
 */
export function useUserRole(requiredRole: string) {
  const [hasRole, setHasRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthState();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setHasRole(false);
      return;
    }

    // Here you would typically fetch the user's roles from Firestore
    // For now, we'll just check a custom claim (if using Firebase Admin SDK)
    currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        setHasRole(!!idTokenResult.claims[requiredRole]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting user roles:', error);
        setLoading(false);
      });
  }, [currentUser, requiredRole]);

  return { hasRole, loading };
}

/**
 * Hook to check if the current user is authenticated
 * @returns Object with isAuthenticated boolean and loading state
 */
export function useIsAuthenticated() {
  const { currentUser, loading } = useAuthState();
  return { isAuthenticated: !!currentUser, loading };
}

/**
 * Hook to get the current user's ID token
 * @returns The current user's ID token or null if not authenticated
 */
export function useIdToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthState();

  useEffect(() => {
    if (!currentUser) {
      setToken(null);
      setLoading(false);
      return;
    }

    currentUser.getIdToken()
      .then((idToken) => {
        setToken(idToken);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting ID token:', error);
        setLoading(false);
      });
  }, [currentUser]);

  return { token, loading };
}
