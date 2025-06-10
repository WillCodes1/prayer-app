import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Denomination = 'Catholic' | 'Protestant' | 'Lutheran' | 'Orthodox' | 'Other';

const denominations: { value: Denomination; label: string }[] = [
  { value: 'Catholic', label: 'Catholic' },
  { value: 'Protestant', label: 'Protestant' },
  { value: 'Lutheran', label: 'Lutheran' },
  { value: 'Orthodox', label: 'Orthodox' },
  { value: 'Other', label: 'Other' },
];

interface DenominationScreenProps {
  onComplete: (denomination: Denomination) => void | Promise<void>;
  onBack?: () => void;
  initialDenomination?: Denomination;
  showBackButton?: boolean;
  isSubmitting?: boolean;
}

export const DenominationScreen: React.FC<DenominationScreenProps> = ({
  onComplete,
  onBack,
  initialDenomination,
  showBackButton = true,
  isSubmitting = false,
}) => {
  const [selectedDenomination, setSelectedDenomination] = useState<Denomination | null>(
    initialDenomination || null
  );

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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            One More Thing
          </h1>
          <p className="text-slate-400 text-lg">What's your Christian tradition?</p>
        </motion.div>

        <motion.div 
          className="w-full space-y-4 flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-full space-y-3 px-2">
            {denominations.map((denomination) => (
              <motion.div 
                key={denomination.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className={cn(
                    'w-full py-5 md:py-6 text-base md:text-lg justify-start',
                    'transition-all duration-300',
                    'bg-white/5 backdrop-blur-sm',
                    'border border-white/10',
                    selectedDenomination === denomination.value 
                      ? 'text-white bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50' 
                      : 'text-slate-300 hover:text-pink-300 hover:bg-white/10 hover:border-white/20',
                    'shadow-lg',
                    selectedDenomination === denomination.value ? 'shadow-purple-500/20' : 'shadow-black/20',
                    'active:scale-[0.98]'
                  )}
                  onClick={() => setSelectedDenomination(denomination.value)}
                >
                  {denomination.label}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-6 w-full"
          >
            <Button
              className={cn(
                'w-full py-6 text-lg font-semibold',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'hover:from-purple-600 hover:to-pink-600',
                'shadow-lg shadow-purple-500/25',
                'transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30',
                'disabled:opacity-50 disabled:scale-100 disabled:shadow-lg',
                (!selectedDenomination || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              )}
              onClick={() => selectedDenomination && onComplete(selectedDenomination)}
              disabled={!selectedDenomination || isSubmitting}
            >
              {isSubmitting ? 'Completing...' : 'Complete Setup'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
