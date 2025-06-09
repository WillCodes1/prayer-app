import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { Navigation } from '@/components/Navigation';
import HomeScreen from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { NameScreen } from '@/screens/onboarding/NameScreen';
import { DenominationScreen } from '@/screens/onboarding/DenominationScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { auth } from './firebase';

const OnboardingFlow = () => {
  const { name, denomination, setName, setDenomination, completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNameSubmit = (name: string) => {
    setName(name);
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const handleDenominationSubmit = (denomination: string) => {
    setDenomination(denomination as any);
    completeOnboarding();
  };

  const steps = [
    <NameScreen 
      key="name" 
      onNext={handleNameSubmit} 
      initialName={name} 
      onBack={handleBack}
      showBackButton={false}
    />,
    <DenominationScreen 
      key="denomination" 
      onComplete={handleDenominationSubmit}
      onBack={handleBack}
      initialDenomination={denomination as any} 
    />
  ];

  return (
    <AnimatePresence mode="wait">
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="h-full w-full overflow-hidden"> {/* Changed overflow-y-auto to overflow-hidden */}
          {steps[currentStep]}
        </div>
      </div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const { hasCompletedOnboarding } = useUser();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'prayer'>('input');

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <OnboardingFlow />;
  }

  // Hide navigation during prayer view
  const hideNavigation = location.pathname === '/' && currentView === 'prayer';

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <HomeScreen 
                onViewChange={(view) => {
                  setCurrentView(view);
                }} 
              />
            } 
          />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!hideNavigation && <Navigation />}
    </>
  );
};

export default function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <AppRoutes />
      </div>
    </UserProvider>
  );
}
