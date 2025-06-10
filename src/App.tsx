import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import HomeScreen from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { NameScreen } from '@/screens/onboarding/NameScreen';
import { DenominationScreen } from '@/screens/onboarding/DenominationScreen';
import { SignInScreen } from '@/screens/auth/SignInScreen';
import { SignUpScreen } from '@/screens/auth/SignUpScreen';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const OnboardingFlow = () => {
  const { name, denomination, setName, setDenomination, completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const { currentUser, loading, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Skip if we've already done the initial check
    if (initialCheckDone) return;

    // Check localStorage first for onboarding status
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
    
    // If no user is signed in, check if we're on an auth route
    if (!currentUser) {
      // If we're not on the signin or signup page, redirect to signin
      if (!['/signin', '/signup'].includes(location.pathname)) {
        navigate('/signin', { replace: true, state: { from: location } });
      }
      setInitialCheckDone(true);
      return;
    }

    // If user has already completed onboarding (either in Firestore or localStorage), redirect to home
    if (hasCompletedOnboarding || userData?.hasCompletedOnboarding) {
      if (location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/onboarding') {
        navigate('/', { replace: true });
      }
      setInitialCheckDone(true);
      return;
    }

    // If we have a user but no userData yet, wait for it to load
    if (currentUser && !userData) {
      return;
    }

    // User is authenticated but hasn't completed onboarding
    // Make sure we're on the onboarding route
    if (!location.pathname.startsWith('/onboarding')) {
      navigate('/onboarding', { replace: true, state: { from: location } });
    }
    
    setInitialCheckDone(true);
  }, [currentUser, loading, navigate, location, userData, initialCheckDone]);

  // Show loading state while checking auth state
  if (loading || !initialCheckDone) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // If no user is signed in, we'll be redirected by the effect
  if (!currentUser) {
    return null;
  }

  // If user has completed onboarding, we'll be redirected by the effect
  if (userData?.hasCompletedOnboarding) {
    return null;
  }

  const handleNameSubmit = async (newName: string) => {
    await setName(newName);
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const handleDenominationSubmit = async (newDenomination: string) => {
    if (isCompleting) return;
    
    try {
      setIsCompleting(true);
      
      // First set the denomination
      await setDenomination(newDenomination as any);
      
      // Then mark onboarding as complete
      await completeOnboarding();
      
      // Set a flag in localStorage to indicate onboarding is complete
      localStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Force a refresh of the auth state
      await refreshUserData();
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      // Force a page reload to ensure all state is properly reset
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Handle error appropriately
    } finally {
      setIsCompleting(false);
    }
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
      isSubmitting={isCompleting}
    />
  ];



  return (
    <AnimatePresence mode="wait">
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="h-full w-full overflow-hidden">
          {steps[currentStep]}
        </div>
      </div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const { hasCompletedOnboarding } = useUser();
  const { currentUser, loading, userData } = useAuth();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<'input' | 'prayer'>('input');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !initialized) {
      setInitialized(true);
    }
  }, [loading, initialized]);

  // Show loading state while checking auth state
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  // If no user is signed in, show auth routes
  if (!currentUser) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/signin" element={<SignInScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route 
            path="/onboarding" 
            element={
              <Navigate to="/signin" state={{ from: { pathname: '/onboarding' } }} replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate 
                to="/signin" 
                state={{ from: { pathname: location.pathname } }} 
                replace 
              />
            } 
          />
        </Routes>
      </AnimatePresence>
    );
  }

  // Check if onboarding is complete (either in context or localStorage)
  const isOnboardingComplete = 
    hasCompletedOnboarding || 
    userData?.hasCompletedOnboarding ||
    localStorage.getItem('hasCompletedOnboarding') === 'true';

  // If user hasn't completed onboarding, show onboarding flow
  if (!isOnboardingComplete) {
    // Only show onboarding if the path is /onboarding
    if (location.pathname === '/onboarding') {
      return <OnboardingFlow />;
    }
    // Otherwise redirect to onboarding
    return <Navigate to="/onboarding" replace state={{ from: location }} />;
  }

  // Hide navigation during prayer view
  const hideNavigation = location.pathname === '/' && currentView === 'prayer';

  return (
    <ProtectedRoute>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!hideNavigation && <Navigation />}
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <AppRoutes />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}
