import { memo } from 'react';
import { motion } from 'framer-motion';

export const Card = memo(({
  children,
  className = '',
  hover = true,
  glow = false,
  glowColor = 'blue',
  ...props
}) => {
  const glowClass = glow ? (glowColor === 'coral' ? 'shadow-glow-coral' : 'shadow-glow-blue') : '';

  return (
    <motion.div
      className={`card ${hover ? 'hover:shadow-card-hover' : ''} ${glowClass} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
