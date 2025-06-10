import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner, Google, Apple } from '@/components/ui/icons';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onAppleSignIn: () => Promise<void>;
  loading: boolean;
}

export function AuthForm({ type, onSubmit, onGoogleSignIn, onAppleSignIn, loading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      await onAppleSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          {type === 'signin' ? 'Sign in to your account' : 'Create an account'}
        </h1>
        <p className="text-slate-400 mt-2">
          {type === 'signin' 
            ? 'Enter your email and password to sign in' 
            : 'Enter your details to create an account'}
        </p>
      </div>

      <div className="grid gap-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleGoogleSignIn}
          disabled={isLoading || loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100"
        >
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Google className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>
        
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleAppleSignIn}
          disabled={isLoading || loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100"
        >
          <Apple className="mr-2 h-4 w-4" />
          Continue with Apple
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
              disabled={isLoading || loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-400">
        {type === 'signin' ? (
          <>
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-400 hover:underline">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="/signin" className="text-indigo-400 hover:underline">
              Sign in
            </a>
          </>
        )}
      </p>
    </div>
  );
}
