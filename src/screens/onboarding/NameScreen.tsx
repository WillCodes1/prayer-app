import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NameScreenProps {
  onNext: (name: string) => void;
  onBack?: () => void;
  initialName?: string;
  showBackButton?: boolean;
}

export const NameScreen: React.FC<NameScreenProps> = ({ 
  onNext, 
  onBack,
  initialName = '',
  showBackButton = true 
}) => {
  const [name, setName] = React.useState(initialName);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="w-full max-w-md mx-auto px-4 pb-8">
        {showBackButton && onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-full w-10 h-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Welcome to Sacred Space
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            A peaceful place to share your heart and receive personalized prayers
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="relative">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-slate-400 mb-2 text-left"
            >
              What's your name?
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  'w-full px-4 py-3 text-white bg-slate-800/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200',
                  isFocused ? 'border-purple-500' : 'border-slate-700',
                  'text-base md:text-lg',
                  'placeholder-slate-500',
                  'focus:outline-none',
                  'backdrop-blur-sm'
                )}
                placeholder="Enter your name"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          <div className="mt-8">
            <Button
              className={cn(
                'w-full py-6 text-lg font-semibold',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'hover:from-purple-600 hover:to-pink-600',
                'shadow-lg shadow-purple-500/25',
                'transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30',
                'disabled:opacity-50 disabled:scale-100 disabled:shadow-lg',
                !name.trim() && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => onNext(name)}
              disabled={!name.trim()}
            >
              Continue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
