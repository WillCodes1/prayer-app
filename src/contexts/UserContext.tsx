import { createContext, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

type Denomination = 'Catholic' | 'Protestant' | 'Lutheran' | 'Orthodox' | 'Other' | '';

interface UserContextType {
  name: string;
  denomination: Denomination;
  hasCompletedOnboarding: boolean;
  setName: (name: string) => Promise<void>;
  setDenomination: (denomination: Denomination) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, updateUserProfile, refreshUserData } = useAuth();
  
  // Get user data from auth context with proper typing
  const name = userData?.name || '';
  const denomination: Denomination = (
    userData?.denomination && ['Catholic', 'Protestant', 'Lutheran', 'Orthodox', 'Other', ''].includes(userData.denomination)
      ? userData.denomination as Denomination
      : ''
  );
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding || false;

  // Update user profile in Firestore
  const updateUser = useCallback(async (data: {
    name?: string;
    denomination?: Denomination;
    hasCompletedOnboarding?: boolean;
  }) => {
    await updateUserProfile(data);
    await refreshUserData();
  }, [updateUserProfile, refreshUserData]);

  const setName = useCallback(async (newName: string) => {
    await updateUser({ name: newName });
  }, [updateUser]);

  const setDenomination = useCallback(async (newDenomination: Denomination) => {
    await updateUser({ denomination: newDenomination });
  }, [updateUser]);

  const completeOnboarding = useCallback(async () => {
    await updateUser({ hasCompletedOnboarding: true });
  }, [updateUser]);

  const resetUser = useCallback(async () => {
    await updateUser({ 
      name: '',
      denomination: '',
      hasCompletedOnboarding: false 
    });
  }, [updateUser]);

  const value = useMemo(() => ({
    name,
    denomination,
    hasCompletedOnboarding,
    setName,
    setDenomination,
    completeOnboarding,
    resetUser,
  }), [
    name, 
    denomination, 
    hasCompletedOnboarding, 
    setName, 
    setDenomination, 
    completeOnboarding, 
    resetUser
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
