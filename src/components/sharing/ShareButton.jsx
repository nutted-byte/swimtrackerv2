import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Reusable share button component
 * Can be used inline or as a standalone button
 */
export const ShareButton = ({
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const variants = {
    default: 'bg-dark-card hover:bg-dark-border text-content-secondary hover:text-primary-400',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    ghost: 'bg-transparent hover:bg-dark-card/50 text-content-tertiary hover:text-primary-400',
    minimal: 'bg-transparent hover:bg-dark-card text-content-tertiary hover:text-primary-400'
  };

  if (children) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-200
          ${variants[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        <Share2 className={iconSizes[size]} />
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title="Share"
      className={`
        ${sizeClasses[size]} rounded-lg
        transition-all duration-200
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <Share2 className={iconSizes[size]} />
    </motion.button>
  );
};
