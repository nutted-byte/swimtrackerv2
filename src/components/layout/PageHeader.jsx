import { motion } from 'framer-motion';
import { tokens } from '../../design/tokens';

/**
 * PageHeader
 *
 * Standardized sticky header bar for all pages.
 * Provides consistent navigation, title display, and action buttons.
 *
 * @param {string} title - Page title displayed in sticky bar
 * @param {ReactNode} actions - Action buttons (e.g., Upload, View Sessions)
 */
export const PageHeader = ({
  title,
  actions
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 ${tokens.zIndex.sticky} -mx-4 px-4 py-3 ${tokens.margin.section} bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border`}
    >
      <div className={`flex items-center justify-between ${tokens.container.xl} mx-auto`}>
        <h1 className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
          {title}
        </h1>
        <div className={`flex items-center ${tokens.gap.tight}`}>
          {actions}
        </div>
      </div>
    </motion.div>
  );
};
