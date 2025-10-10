import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const CollapsibleSection = ({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  icon: Icon,
  badge,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={className}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group"
      >
        <div className="flex items-center justify-between p-4 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors border border-dark-border hover:border-primary-500/30">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold">{title}</h3>
                {badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {isExpanded ? 'Hide' : 'Show'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
