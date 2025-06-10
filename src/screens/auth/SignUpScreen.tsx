import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowLeft, User, Check } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase/errors';

export function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  // The redirect URL is handled by the AuthProvider

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await signUp(email, password);
      // The AuthProvider will handle redirection based on auth state
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
    setError('');
    setLoading(true);

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      // The AuthProvider will handle redirection based on auth state
    } catch (error: any) {
      console.error(`${provider} sign up error:`, error);
      setError(`Failed to sign up with ${provider === 'google' ? 'Google' : 'Apple'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains special char
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="mt-2 text-slate-400">Join our community today</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/50 py-6 pl-10 text-white placeholder-slate-400 backdrop-blur-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 py-6 pl-10 text-white placeholder-slate-400 backdrop-blur-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 py-6 pl-10 text-white placeholder-slate-400 backdrop-blur-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            
            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="mb-1 flex h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 0 ? 'w-1/4 bg-red-500' :
                      passwordStrength === 1 ? 'w-1/2 bg-orange-500' :
                      passwordStrength === 2 ? 'w-3/4 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center">
                    <Check className={`mr-1 h-3 w-3 ${password.length >= 8 ? 'text-green-500' : 'text-slate-600'}`} />
                    <span className={password.length >= 8 ? 'text-slate-300' : ''}>8+ characters</span>
                  </div>
                  <div className="flex items-center">
                    <Check className={`mr-1 h-3 w-3 ${/\d/.test(password) ? 'text-green-500' : 'text-slate-600'}`} />
                    <span className={/\d/.test(password) ? 'text-slate-300' : ''}>Number</span>
                  </div>
                  <div className="flex items-center">
                    <Check className={`mr-1 h-3 w-3 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-slate-600'}`} />
                    <span className={/[A-Z]/.test(password) ? 'text-slate-300' : ''}>Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    <Check className={`mr-1 h-3 w-3 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-500' : 'text-slate-600'}`} />
                    <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-slate-300' : ''}>Special char</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-800/50 py-6 pl-10 text-white placeholder-slate-400 backdrop-blur-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 py-6 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-400">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignUp('google')}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-4 py-6 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Signing up...' : 'Continue with Google'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignUp('apple')}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-4 py-6 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.85 1.62-3.09 1.62-1.28 0-1.94-.65-2.8-1.5-.62-.62-1.19-1.5-2.25-1.5-1.05 0-1.64.88-2.25 1.5-.86.85-1.52 1.5-2.8 1.5-1.24 0-2.27-.38-3.09-1.62C2.94 18.12 2 15.45 2 12.5c0-3.13 2.03-4.75 4.05-4.75 1.05 0 2.05.43 2.7.5.52.05 1.09-.15 1.5-.3.41-.15.92-.3 1.5-.3.58 0 1.09.15 1.5.3.41.15.98.35 1.5.3.65-.07 1.65-.5 2.7-.5 2.02 0 4.05 1.62 4.05 4.75 0 2.95-.94 5.62-2.29 7.5zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.29-1 3.15-.74.95-1.93 1.6-3.05 1.5-.14-1.15.35-2.32 1-3.15z" />
              <path d="M15.92 2.08c.5-.08 1 0 1.5.3.5.2 1 .6 1.4 1 .4.4.8.9 1 1.4.3.5.4 1 .3 1.5-.1.5-.4 1-.8 1.4-.4.4-.9.7-1.4.8-.5.1-1 0-1.5-.3-.5-.2-1-.6-1.4-1-.4-.4-.8-.9-1-1.4-.3-.5-.4-1-.3-1.5.1-.5.4-1 .8-1.4.4-.4.9-.7 1.4-.8z" />
            </svg>
            {loading ? 'Signing up...' : 'Continue with Apple'}
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
