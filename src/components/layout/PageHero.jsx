import { motion } from 'framer-motion';
import { tokens } from '../../design/tokens';

/**
 * PageHero
 *
 * Standardized hero section with configurable alignment and optional icon.
 * Used for main page titles and introductory content.
 *
 * @param {string} title - Main hero title
 * @param {string} subtitle - Optional subtitle text
 * @param {Component} icon - Optional Lucide icon component
 * @param {'center'|'left'} align - Text alignment ('center' for Dashboard/Records, 'left' for data pages)
 * @param {ReactNode} children - Additional content below title/subtitle
 */
export const PageHero = ({
  title,
  subtitle,
  icon: Icon,
  align = 'center',
  children
}) => {
  const alignClass = align === 'center' ? 'text-center' : '';
  const flexClass = align === 'center' ? 'flex items-center justify-center gap-2' : 'flex items-center gap-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${alignClass}`}
    >
      <div className={Icon ? flexClass : ''}>
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Icon className={`${tokens.icons['2xl']} text-primary-400`} />
          </motion.div>
        )}
        <h2 className={`${tokens.typography.families.display} ${tokens.typography.sizes['4xl']} ${tokens.typography.weights.bold}`}>
          {title}
        </h2>
      </div>

      {subtitle && (
        <p className="text-gray-400">
          {subtitle}
        </p>
      )}

      {children}
    </motion.div>
  );
};
