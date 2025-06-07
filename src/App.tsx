import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';

// Define types for the API response
interface ApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is not set. Please check your .env.local file.');
    throw new Error('API key is not configured');
  }
  return apiKey;
};

const generateApiUrl = (apiKey: string): string => 
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;


export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'input' | 'prayer'>('welcome');
  const [userInput, setUserInput] = useState('');
  const [generatedPrayer, setGeneratedPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePrayer = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setCurrentView('prayer');

    try {
      // Safety check for self-harm or suicide-related content
      const selfHarmKeywords = ['suicide', 'kill myself', 'self-harm', 'end my life'];
      const containsSelfHarm = selfHarmKeywords.some(keyword =>
        userInput.toLowerCase().includes(keyword)
      );

      if (containsSelfHarm) {
        setGeneratedPrayer("If you are in immediate danger, please call or text the 988 Suicide & Crisis Lifeline. You are not alone and help is available.");
        setIsGenerating(false);
        return;
      }

      const apiKey = getApiKey();
      const apiUrl = generateApiUrl(apiKey);

      const prompt = `You are a compassionate and eloquent Christian expert and friend. Your purpose is to provide comfort and create a personalized prayer for the user based on their specific needs and feelings. The prayer should be heartfelt, encouraging, and written in a supportive and uplifting tone. Use Bible texts in NIV and only use things related to Christian faith, no other religions.

User's situation:
"${userInput}"

Based on the user's situation, please generate a prayer that is approximately 4-6 sentences long.`;

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              contents: [
                  {
                      parts: [
                          {
                              text: prompt,
                          },
                      ],
                  },
              ],
          }),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text || 
                 'Your prayer has been received. May you find peace and comfort.';
      
      setGeneratedPrayer(text);
    } catch (error) {
      console.error("Error generating prayer:", error);
      setGeneratedPrayer(
        "We're having trouble connecting to the prayer service. Please check your internet connection and try again later."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setCurrentView('welcome');
    setUserInput('');
    setGeneratedPrayer('');
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                >
                  Sacred Space
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-slate-400 text-lg leading-relaxed"
                >
                  A peaceful place to share your heart and receive personalized prayers
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full"
              >
                <Button
                  onClick={() => setCurrentView('input')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Begin Your Journey
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentView === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2 pt-8"
              >
                <h2 className="text-2xl font-semibold text-white">Share Your Heart</h2>
                <p className="text-slate-400">What's on your mind today? Express your thoughts, worries, or gratitude.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-1">
                  <Textarea
                    value={userInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                    placeholder="I'm feeling overwhelmed with work and could use some guidance and peace..."
                    className="min-h-[300px] bg-transparent border-none resize-none text-white placeholder-slate-400 text-base leading-relaxed focus:ring-0 p-6 rounded-3xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleGeneratePrayer}
                  disabled={!userInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 disabled:hover:scale-100 disabled:shadow-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Create My Prayer
                </Button>

                <Button
                  onClick={() => setCurrentView('welcome')}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5 py-3 rounded-xl transition-all duration-300"
                >
                  Back
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentView === 'prayer' && (
            <motion.div
              key="prayer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col space-y-6"
            >
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col justify-center items-center space-y-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110"></div>
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Crafting Your Prayer</h3>
                    <p className="text-slate-400">Creating something beautiful just for you...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2 pt-4"
                  >
                    <h2 className="text-2xl font-semibold text-white">Your Personal Prayer</h2>
                    <p className="text-slate-400">Crafted with love and intention</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative flex-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 h-full">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-white text-base leading-relaxed italic"
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
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Create Another Prayer
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}