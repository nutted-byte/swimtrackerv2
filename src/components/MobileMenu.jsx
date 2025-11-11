import { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Upload, LogOut, User, BookOpen, Home, List, BarChart3, Target } from 'lucide-react';
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
            <div className="p-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2 mb-4">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/'
                      ? 'bg-primary-500/20 text-primary-400'
                      : isDark
                        ? 'text-content-secondary hover:bg-dark-bg/50'
                        : 'text-content-secondary hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/swims"
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/swims')
                      ? 'bg-primary-500/20 text-primary-400'
                      : isDark
                        ? 'text-content-secondary hover:bg-dark-bg/50'
                        : 'text-content-secondary hover:bg-slate-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="font-medium">Swims</span>
                </Link>

                <Link
                  to="/insight"
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/insight')
                      ? 'bg-primary-500/20 text-primary-400'
                      : isDark
                        ? 'text-content-secondary hover:bg-dark-bg/50'
                        : 'text-content-secondary hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Insight</span>
                </Link>

                <Link
                  to="/train"
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/train')
                      ? 'bg-primary-500/20 text-primary-400'
                      : isDark
                        ? 'text-content-secondary hover:bg-dark-bg/50'
                        : 'text-content-secondary hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Train</span>
                </Link>

                <Link
                  to="/learn"
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/learn')
                      ? 'bg-primary-500/20 text-primary-400'
                      : isDark
                        ? 'text-content-secondary hover:bg-dark-bg/50'
                        : 'text-content-secondary hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Learn</span>
                </Link>
              </div>

              {/* Divider */}
              <div className={`border-t ${isDark ? 'border-dark-border' : 'border-slate-200'}`}></div>

              {/* Upload */}
              <Link
                to="/upload"
                onClick={closeMenu}
                className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload</span>
              </Link>

              {/* Toggle light/dark mode */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                isDark ? 'bg-dark-bg/50' : 'bg-slate-50'
              }`}>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-content-secondary' : 'text-content-secondary'
                }`}>Toggle light / dark mode</span>
                <ThemeToggle />
              </div>

              {/* Name */}
              <div className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
                isDark ? 'bg-dark-bg/50' : 'bg-slate-50'
              }`}>
                <User className={`w-5 h-5 ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`} />
                <span className={`font-medium ${
                  isDark ? 'text-content-secondary' : 'text-content-secondary'
                }`}>
                  {user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0] ||
                   'User'}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  closeMenu();
                  onSignOut();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-dark-bg hover:bg-accent-coral/20 text-content-tertiary hover:text-accent-coral'
                    : 'bg-slate-50 hover:bg-red-50 text-content-tertiary hover:text-red-600'
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
      className={`md:hidden p-3 rounded-lg transition-colors ${
        isDark
          ? 'hover:bg-dark-card text-content-tertiary hover:text-content-secondary'
          : 'hover:bg-slate-100 text-content-tertiary hover:text-content'
      }`}
      aria-label="Menu"
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};
