import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback 
} from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../lib/firebase';
import { createUserDocument, getUserData, updateUserData, UserData } from '../lib/firebase';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = useCallback(async (user: FirebaseUser) => {
    try {
      // Create user document if it doesn't exist
      await createUserDocument(user);
      
      // Get the latest user data
      const data = await getUserData(user.uid);
      if (data) {
        setUserData(data);
      }
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  // Update user profile in Firestore
  const updateUserProfile = useCallback(async (data: Partial<UserData>) => {
    if (!currentUser) return;
    
    try {
      await updateUserData(currentUser.uid, data);
      const updatedData = await getUserData(currentUser.uid);
      if (updatedData) {
        setUserData(updatedData);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, [currentUser]);

  // Refresh user data
  const refreshUserData = useCallback(async (): Promise<void> => {
    if (!currentUser) return;
    await fetchUserData(currentUser);
  }, [currentUser, fetchUserData]);

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true;
    
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
      
      if (isMounted) {
        if (user) {
          setCurrentUser(user);
          try {
            const userData = await fetchUserData(user);
            if (isMounted) {
              setUserData(userData);
              
              // Update localStorage based on onboarding status
              if (userData) {
                if (!userData.hasCompletedOnboarding) {
                  localStorage.removeItem('hasCompletedOnboarding');
                } else {
                  localStorage.setItem('hasCompletedOnboarding', 'true');
                }
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData(null);
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          setUserData(null);
          localStorage.removeItem('hasCompletedOnboarding');
        }
        setLoading(false);
      }
    });
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(user);
  };

  const signUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(user);
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      console.log('Initiating Google sign in with popup...');
      
      // Sign out any existing user
      await auth.signOut();
      
      // Start the sign-in with popup
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user.uid);
      
      // Create/update user document
      await createUserDocument(result.user);
      
      // Fetch and update user data
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithApple = async (): Promise<void> => {
    try {
      console.log('Initiating Apple sign in with popup...');
      
      // Sign out any existing user
      await auth.signOut();
      
      // Start the sign-in with popup
      const result = await signInWithPopup(auth, appleProvider);
      console.log('Apple sign in successful:', result.user.uid);
      
      // Create/update user document
      await createUserDocument(result.user);
      
      // Fetch and update user data
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Error signing in with Apple:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      // Reset user state
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    updateUserProfile,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
