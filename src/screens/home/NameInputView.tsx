import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NameInputViewProps {
  onNext: (name: string) => void;
  onBack: () => void;
}

export function NameInputView({ onNext, onBack }: NameInputViewProps) {
  const [name, setName] = React.useState('');

  return (
    <motion.div
      key="name-input"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-[calc(100vh-120px)] px-4"
    >
      <div className="flex-1 flex flex-col space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-semibold text-white">What's your name?</h2>
          <p className="text-slate-400">We'll use this to personalize your experience.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-transparent border-none text-white text-lg placeholder-slate-400 focus:ring-0 p-0"
              autoFocus
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-0 left-0 right-0 px-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-6 pb-6"
      >
        <div className="pb-4">
          <Button
            onClick={() => onNext(name.trim())}
            disabled={!name.trim()}
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
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
