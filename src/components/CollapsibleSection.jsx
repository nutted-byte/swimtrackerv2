import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { tokens } from '../design/tokens';

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
  const { isDark } = useTheme();

  return (
    <div className={className}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group"
      >
        <div className={`
          flex items-center justify-between ${tokens.padding.default} ${tokens.radius.sm} transition-all
          ${isDark
            ? 'bg-dark-card hover:bg-dark-card/80'
            : 'bg-white hover:bg-slate-50'
          }
        `}>
          <div className={`flex items-center ${tokens.gap.tight}`}>
            {Icon && (
              <div className={`
                ${tokens.components.iconContainer.md} ${tokens.radius.full} flex items-center justify-center transition-colors
                ${isDark
                  ? 'bg-primary-500/20 group-hover:bg-primary-500/30'
                  : 'bg-primary-50 group-hover:bg-primary-100'
                }
              `}>
                <Icon className={`${tokens.icons.md} ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
              </div>
            )}
            <div className="text-left">
              <div className={`flex items-center ${tokens.gap.tight}`}>
                <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold}`}>{title}</h3>
                {badge && (
                  <span className={`
                    px-2 py-0.5 ${tokens.typography.sizes.xs} ${tokens.typography.weights.medium} ${tokens.radius.full}
                    ${isDark
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'bg-primary-100 text-primary-700'
                    }
                  `}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className={`${tokens.typography.sizes.sm} mt-0.5 ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className={`flex items-center ${tokens.gap.tight}`}>
            <span className={`${tokens.typography.sizes.sm} ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`}>
              {isExpanded ? 'Hide' : 'Show'}
            </span>
            {isExpanded ? (
              <ChevronUp className={`
                ${tokens.icons.md} transition-colors
                ${isDark
                  ? 'text-content-tertiary group-hover:text-primary-400'
                  : 'text-content-tertiary group-hover:text-primary-500'
                }
              `} />
            ) : (
              <ChevronDown className={`
                ${tokens.icons.md} transition-colors
                ${isDark
                  ? 'text-content-tertiary group-hover:text-primary-400'
                  : 'text-content-tertiary group-hover:text-primary-500'
                }
              `} />
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
