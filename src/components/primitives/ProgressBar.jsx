import { motion } from 'framer-motion';
import { tokens } from '../../design/tokens';

/**
 * ProgressBar - Reusable progress bar component
 *
 * A composition primitive for displaying progress with optional label and percentage
 *
 * @param {number} value - Progress value (0-100)
 * @param {string} label - Optional label text (e.g., "Progress", "Completion")
 * @param {string|React.ReactNode} valueDisplay - Optional custom value display (e.g., "5/10", "75%")
 * @param {boolean} showPercentage - Show percentage in value display (default: false)
 * @param {string} color - Bar color variant: 'primary'|'blue'|'green'|'orange'|'red'|'purple' (default: 'primary')
 * @param {string} size - Bar height: 'sm'|'md'|'lg' (default: 'md')
 * @param {boolean} animate - Enable width animation (default: true)
 * @param {number} animationDelay - Animation delay in seconds (default: 0)
 * @param {string} className - Additional classes for the container
 */
export const ProgressBar = ({
  value = 0,
  label = null,
  valueDisplay = null,
  showPercentage = false,
  color = 'primary',
  size = 'md',
  animate = true,
  animationDelay = 0,
  className = ''
}) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  // Color configurations
  const colorClasses = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  // Size configurations
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-2.5'
  };

  const barColor = colorClasses[color] || colorClasses.primary;
  const barHeight = sizeClasses[size] || sizeClasses.md;

  // Default value display
  const displayValue = valueDisplay !== null
    ? valueDisplay
    : showPercentage
      ? `${Math.round(clampedValue)}%`
      : null;

  return (
    <div className={className}>
      {/* Header with label and value */}
      {(label || displayValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className={`${tokens.typography.sizes.xs} font-medium text-content-secondary`}>
              {label}
            </span>
          )}
          {displayValue && (
            <span className={`${tokens.typography.sizes.xs} font-bold text-primary-400`}>
              {displayValue}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full bg-dark-border ${tokens.radius.full} ${barHeight} overflow-hidden`}>
        {animate ? (
          <motion.div
            className={`${barColor} h-full ${tokens.radius.full}`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.6, delay: animationDelay }}
          />
        ) : (
          <div
            className={`${barColor} h-full ${tokens.radius.full}`}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  );
};
