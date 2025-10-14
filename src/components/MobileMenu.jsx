import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Upload, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export const MobileMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-dark-card transition-colors text-gray-400 hover:text-gray-200"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-dark-card border-l border-dark-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center text-2xl">
                  🌊
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent">
                    Swimma
                  </h2>
                  <p className="text-xs text-gray-400">Menu</p>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-dark-border bg-dark-bg/50">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 truncate">{user?.email}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                to="/upload"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/upload')
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload</span>
              </Link>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Sign Out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border bg-dark-card">
              <button
                onClick={() => {
                  closeMenu();
                  onSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-dark-bg hover:bg-accent-coral/20 text-gray-400 hover:text-accent-coral transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
