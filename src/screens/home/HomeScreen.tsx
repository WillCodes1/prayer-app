import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

async function generatePrayer(prompt: string, denomination: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const fullPrompt = `Create a Christian prayer based on the following request: "${prompt}"
    
    Prayer Guidelines:
    - Keep it between 100-150 words
    - Use a reverent and personal tone
    - Include elements of gratitude, supplication, and surrender to God's will
    - Make it appropriate for ${denomination} Christian tradition
    - Format with appropriate line breaks for readability
    - Sign with "In Jesus' name, Amen.
    - You must include Bible verses relevant to the prayer at the end`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating prayer:', error);
    throw new Error('Failed to generate prayer. Please try again.');
  }
}

type View = 'input' | 'prayer';

interface HomeScreenProps {
  onViewChange: (view: View) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewChange }) => {
  const { denomination } = useUser();
  const [currentView, setCurrentView] = useState<View>('input');
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState('');

  const handleGeneratePrayer = async () => {
    // Note: userInput.trim() check is now done in the onClick handler
    try {
      const prayer = await generatePrayer(userInput, denomination || 'non-denominational');
      setGeneratedPrayer(prayer);
      // setCurrentView and onViewChange are now handled by the caller
    } catch (error) {
      console.error('Error generating prayer:', error);
      setGeneratedPrayer("I'm sorry, but I encountered a little trouble crafting your prayer. Please try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setUserInput('');
    setCurrentView('input');
    onViewChange('input');
    setGeneratedPrayer('');
  };

  const renderPrayerView = () => (
    <motion.div
      key="prayer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex flex-col p-4 md:p-6 max-w-2xl mx-auto min-h-[calc(100vh-80px)]"
    >
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        {isGenerating ? (
          <div className="w-full max-w-md flex flex-col items-center justify-center space-y-6 py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                <Loader2 className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <div className="text-center space-y-2">
              <p className="text-slate-200 text-lg font-medium">Crafting your prayer...</p>
              <p className="text-slate-500 text-sm">Please wait a moment.</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 space-y-6 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Button
                onClick={() => {
                  setCurrentView('input');
                  onViewChange('input');
                }}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full w-10 h-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-white">Your Personal Prayer</h2>
                <p className="text-slate-400">Crafted with love and intention</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative flex-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-6 min-h-[200px] max-h-[50vh] overflow-y-auto">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-white text-base leading-relaxed italic whitespace-pre-line break-words overflow-wrap-anywhere"
                >
                  {generatedPrayer}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Button
                onClick={resetApp}
                className={cn(
                  'w-full py-6 text-lg font-semibold',
                  'bg-gradient-to-r from-purple-600 to-pink-600',
                  'hover:from-purple-700 hover:to-pink-700',
                  'shadow-lg shadow-purple-500/25',
                  'transition-all duration-300',
                  'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30',
                  'text-white'
                )}
              >
                Create Another Prayer
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const renderInputView = () => (
    <motion.div
      key="input"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full flex flex-col p-4 md:p-6 max-w-2xl mx-auto min-h-[calc(100vh-80px)]"
    >
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 w-full"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Create Your Prayer</h1>
            <p className="text-slate-400">
              Share what's on your heart, and I'll craft a personalized prayer for you.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Textarea
                placeholder="What would you like to pray about today?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[120px] resize-none bg-slate-800/50 border-slate-700/50 focus-visible:ring-purple-500/50"
              />
            </div>

            <Button
              onClick={() => {
                if (!userInput.trim()) return;
                setIsGenerating(true);
                setCurrentView('prayer');
                onViewChange('prayer');
                handleGeneratePrayer();
              }}
              disabled={!userInput.trim() || isGenerating}
              className={cn(
                'w-full py-6 text-lg font-semibold',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'hover:from-purple-600 hover:to-pink-600',
                'shadow-lg shadow-purple-500/25',
                'transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30',
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Prayer...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Create My Prayer
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="h-full w-full overflow-hidden"> {/* Changed overflow-y-auto to overflow-hidden */}
        <div className="pt-4"></div>
        <AnimatePresence mode="wait">
          {currentView === 'prayer' ? renderPrayerView() : renderInputView()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomeScreen;
