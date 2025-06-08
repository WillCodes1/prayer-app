import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Denomination = 'Catholic' | 'Protestant' | 'Lutheran' | 'Orthodox' | 'Other' | '';

interface UserContextType {
  name: string;
  denomination: Denomination;
  hasCompletedOnboarding: boolean;
  setName: (name: string) => void;
  setDenomination: (denomination: Denomination) => void;
  completeOnboarding: () => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState(
    localStorage.getItem('userName') || ''
  );
  const [denomination, setDenomination] = useState<Denomination>(
    (localStorage.getItem('userDenomination') as Denomination) || ''
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    localStorage.getItem('hasCompletedOnboarding') === 'true'
  );

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userDenomination', denomination);
    setHasCompletedOnboarding(true);
  }, [name, denomination]);

  const resetUser = useCallback(() => {
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDenomination');
    setName('');
    setDenomination('');
    setHasCompletedOnboarding(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        name,
        denomination,
        hasCompletedOnboarding,
        setName,
        setDenomination,
        completeOnboarding,
        resetUser,
      }}
    >
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
