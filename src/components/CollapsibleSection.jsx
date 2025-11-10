import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
          flex items-center justify-between p-4 rounded-lg transition-all border
          ${isDark
            ? 'bg-dark-card hover:bg-dark-card/80 border-dark-border hover:border-primary-500/30'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-primary-400 shadow-card-light hover:shadow-elevated'
          }
        `}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${isDark
                  ? 'bg-primary-500/20 group-hover:bg-primary-500/30'
                  : 'bg-primary-50 group-hover:bg-primary-100'
                }
              `}>
                <Icon className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold">{title}</h3>
                {badge && (
                  <span className={`
                    px-2 py-0.5 text-xs font-medium rounded-full
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
                <p className={`text-sm mt-0.5 ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`}>
              {isExpanded ? 'Hide' : 'Show'}
            </span>
            {isExpanded ? (
              <ChevronUp className={`
                w-5 h-5 transition-colors
                ${isDark
                  ? 'text-content-tertiary group-hover:text-primary-400'
                  : 'text-content-tertiary group-hover:text-primary-500'
                }
              `} />
            ) : (
              <ChevronDown className={`
                w-5 h-5 transition-colors
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
