import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Reusable empty state component
 */
export const EmptyState = ({
  emoji = '📊',
  title,
  description,
  actionLabel,
  actionTo,
  className = ''
}) => {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-16 text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-8xl mb-6">{emoji}</div>
        <h1 className="font-display text-4xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          {description}
        </p>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="btn-primary">
            {actionLabel}
          </Link>
        )}
      </motion.div>
    </div>
  );
};
