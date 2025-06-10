import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Edit, ChevronDown, Check, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Denomination = 'Catholic' | 'Protestant' | 'Lutheran' | 'Orthodox' | 'Other';

export const ProfileScreen = () => {
  const { name, denomination, setName, setDenomination } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showDenominationDropdown, setShowDenominationDropdown] = useState(false);
  const [selectedDenomination, setSelectedDenomination] = useState<Denomination | null>(denomination as Denomination || null);

  const denominations: { value: Denomination; label: string }[] = [
    { value: 'Catholic', label: 'Catholic' },
    { value: 'Protestant', label: 'Protestant' },
    { value: 'Lutheran', label: 'Lutheran' },
    { value: 'Orthodox', label: 'Orthodox' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSave = () => {
    if (newName && newName.trim() !== '') {
      setName(newName);
    }
    if (selectedDenomination) {
      setDenomination(selectedDenomination);
    }
    setIsEditing(false);
  };



  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 pb-24"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Your Profile
          </h1>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full"
            >
              <Edit className="w-5 h-5" />
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setNewName(name);
                  setSelectedDenomination(denomination as Denomination || null);
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="sm"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                ) : (
                  <p className="text-lg text-white">{name || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Denomination</label>
                {isEditing ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDenominationDropdown(!showDenominationDropdown)}
                      className={cn(
                        'w-full flex justify-between items-center bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-left',
                        'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent',
                        showDenominationDropdown ? 'ring-2 ring-purple-500/50' : ''
                      )}
                    >
                      <span className={selectedDenomination ? 'text-white' : 'text-slate-400'}>
                        {selectedDenomination || 'Select a denomination'}
                      </span>
                      <ChevronDown className={cn(
                        'w-5 h-5 text-slate-400 transition-transform duration-200',
                        showDenominationDropdown ? 'transform rotate-180' : ''
                      )} />
                    </button>
                    
                    {showDenominationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 mt-1 w-full bg-slate-800 rounded-xl border border-white/10 shadow-lg overflow-hidden"
                      >
                        {denominations.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            className={cn(
                              'w-full px-4 py-3 text-left text-sm flex items-center justify-between',
                              'hover:bg-slate-700/50 transition-colors duration-200',
                              selectedDenomination === item.value ? 'bg-slate-700/30' : ''
                            )}
                            onClick={() => {
                              setSelectedDenomination(item.value);
                              setShowDenominationDropdown(false);
                            }}
                          >
                            <span>{item.label}</span>
                            {selectedDenomination === item.value && (
                              <Check className="w-4 h-4 text-purple-400" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-white">{denomination || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="pt-4">
            <div className="space-y-4 mt-8 w-full max-w-xs mx-auto">

              <Button
                onClick={handleSignOut}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
