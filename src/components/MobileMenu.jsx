import { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Upload, LogOut, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

// Create a context to share menu state
const MobileMenuContext = createContext();

export const MobileMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    // Fallback for when used outside provider
    const [isOpen, setIsOpen] = useState(false);
    return {
      isOpen,
      toggleMenu: () => setIsOpen(!isOpen),
      closeMenu: () => setIsOpen(false)
    };
  }
  return context;
};

export const MobileMenu = ({ user, onSignOut, menuOnly = false }) => {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { isDark } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  // If menuOnly is true, only render the dropdown menu
  if (menuOnly) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`md:hidden overflow-hidden border-b sticky top-[73px] z-40 ${
              isDark
                ? 'bg-dark-card border-dark-border'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Menu Items */}
            <div className="p-6 space-y-3">
              {/* 1. Upload */}
              <Link
                to="/upload"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload</span>
              </Link>

              {/* 2. Toggle light/dark mode */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                isDark ? 'bg-dark-bg/50' : 'bg-slate-50'
              }`}>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-slate-700'
                }`}>Toggle light / dark mode</span>
                <ThemeToggle />
              </div>

              {/* 3. Name */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isDark ? 'bg-dark-bg/50' : 'bg-slate-50'
              }`}>
                <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  {user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0] ||
                   'User'}
                </span>
              </div>

              {/* 4. Logout */}
              <button
                onClick={() => {
                  closeMenu();
                  onSignOut();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-dark-bg hover:bg-accent-coral/20 text-gray-400 hover:text-accent-coral'
                    : 'bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Otherwise, only render the hamburger button
  return (
    <button
      onClick={toggleMenu}
      className={`md:hidden p-2 rounded-lg transition-colors ${
        isDark
          ? 'hover:bg-dark-card text-gray-400 hover:text-gray-200'
          : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
      }`}
      aria-label="Menu"
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};
