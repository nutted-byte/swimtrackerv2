import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Card = memo(({
  children,
  className = '',
  hover = true,
  glow = false,
  glowColor = 'blue',
  elevated = false,
  ...props
}) => {
  const { isDark } = useTheme();

  // Theme-aware glow
  const glowClass = glow
    ? (glowColor === 'coral'
      ? (isDark ? 'shadow-glow-coral' : 'shadow-glow-coral-light')
      : (isDark ? 'shadow-glow-blue' : 'shadow-glow-blue-light'))
    : '';

  // Elevated cards get extra shadow in light mode
  const elevatedClass = elevated && !isDark ? 'shadow-elevated' : '';

  return (
    <motion.div
      className={`card ${glowClass} ${elevatedClass} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
