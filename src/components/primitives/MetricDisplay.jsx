import { motion } from 'framer-motion';

/**
 * MetricDisplay - Reusable metric display component
 *
 * A composition primitive for displaying metrics with icon, label, value, and unit
 *
 * @param {React.Component} icon - Icon component from lucide-react
 * @param {string} label - Metric label (e.g., "Pace", "Distance")
 * @param {string|number} value - Metric value
 * @param {string} unit - Unit text (e.g., "min/100m", "km")
 * @param {React.ReactNode} badge - Optional badge component (e.g., "Fast", "PR", trend)
 * @param {string} variant - Color variant: 'blue'|'primary'|'orange'|'red'|'purple'|'green'|'yellow' (default: 'blue')
 * @param {boolean} hover - Enable hover animation (default: true)
 * @param {object} motionVariants - Optional framer-motion variants for animations
 * @param {string} className - Additional classes for the container
 */
export const MetricDisplay = ({
  icon: Icon,
  label,
  value,
  unit = null,
  badge = null,
  variant = 'blue',
  hover = true,
  motionVariants = null,
  className = ''
}) => {
  // Color configurations for each variant
  const variantStyles = {
    blue: {
      container: 'from-accent-blue/10 to-accent-blue/5 border-accent-blue/20',
      hover: 'from-accent-blue/0 to-accent-blue/10',
      iconBg: 'bg-accent-blue/20',
      iconColor: 'text-accent-blue'
    },
    primary: {
      container: 'from-primary-500/10 to-primary-500/5 border-primary-500/20',
      hover: 'from-primary-500/0 to-primary-500/10',
      iconBg: 'bg-primary-500/20',
      iconColor: 'text-primary-400'
    },
    orange: {
      container: 'from-orange-500/10 to-red-500/5 border-orange-500/20',
      hover: 'from-orange-500/0 to-red-500/10',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },
    red: {
      container: 'from-red-500/10 to-pink-500/5 border-red-500/20',
      hover: 'from-red-500/0 to-pink-500/10',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    purple: {
      container: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
      hover: 'from-purple-500/0 to-purple-500/10',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    },
    green: {
      container: 'from-green-500/10 to-emerald-500/5 border-green-500/20',
      hover: 'from-green-500/0 to-emerald-500/10',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    yellow: {
      container: 'from-yellow-500/10 to-amber-500/5 border-yellow-500/20',
      hover: 'from-yellow-500/0 to-amber-500/10',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    }
  };

  const colors = variantStyles[variant] || variantStyles.blue;

  const content = (
    <div className={`relative bg-gradient-to-br ${colors.container} rounded-lg p-4 border group overflow-hidden ${className}`}>
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        {/* Icon and Label Row */}
        <div className="flex items-center gap-2 mb-2">
          {Icon && (
            <div className={`p-3 ${colors.iconBg} rounded-lg`}>
              <Icon className={`w-4 h-4 ${colors.iconColor}`} />
            </div>
          )}
          <span className="text-content-secondary text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
          {badge}
        </div>

        {/* Value */}
        <p className="font-display text-xl font-bold text-content tabular-nums">
          {value}
        </p>

        {/* Unit */}
        {unit && (
          <p className="text-xs text-content-tertiary mt-0.5">
            {unit}
          </p>
        )}
      </div>
    </div>
  );

  // Wrap with motion if variants provided or hover is enabled
  if (motionVariants || hover) {
    return (
      <motion.div
        variants={motionVariants}
        whileHover={hover ? { scale: 1.05, y: -2 } : undefined}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
