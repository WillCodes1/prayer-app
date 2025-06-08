import { Link, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 pb-4 px-4 max-w-md mx-auto"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 30 }}
      style={{ 
        maxWidth: 'calc(100% - 2rem)',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        bottom: 'env(safe-area-inset-bottom, 1rem)'
      }}
    >
      <div className="relative w-full">
        {/* Background blur */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl -z-10"></div>
        
        <div className="flex justify-around items-center p-1.5 bg-slate-800/30 rounded-2xl border border-white/10 w-full">
          <Link
            to="/"
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 py-3 rounded-xl',
              'transition-all duration-300',
              isActive('/') 
                ? 'text-white' 
                : 'text-slate-400 hover:text-pink-300 hover:bg-white/5'
            )}
          >
            {isActive('/') && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
            <Home className={cn(
              'h-5 w-5 relative z-10',
              isActive('/') ? 'text-purple-400' : 'text-current'
            )} />
            <span className="text-xs mt-1.5 relative z-10">Home</span>
          </Link>
          
          <Link
            to="/profile"
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 py-3 rounded-xl',
              'transition-all duration-300',
              isActive('/profile') 
                ? 'text-white' 
                : 'text-slate-400 hover:text-pink-300 hover:bg-white/5'
            )}
          >
            {isActive('/profile') && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
            <User className={cn(
              'h-5 w-5 relative z-10',
              isActive('/profile') ? 'text-pink-400' : 'text-current'
            )} />
            <span className="text-xs mt-1.5 relative z-10">Profile</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
