import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WelcomeViewProps {
  onNext: () => void;
}

export function WelcomeView({ onNext }: WelcomeViewProps) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col justify-center items-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110"></div>
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.h1 
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Welcome to Sacred Space
      </motion.h1>
      
      <motion.p 
        className="text-slate-400 text-lg mb-8 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Create personalized prayers that speak to your heart and bring you closer to God.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={onNext}
          className={cn(
            'w-full py-6 text-lg font-semibold',
            'bg-gradient-to-r from-purple-500 to-pink-500',
            'hover:from-purple-600 hover:to-pink-600',
            'shadow-lg shadow-purple-500/25',
            'transition-all duration-300',
            'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30',
          )}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Begin Your Prayer
        </Button>
      </motion.div>
    </motion.div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
