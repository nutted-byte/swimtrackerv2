import { motion } from 'framer-motion';
import { MetricDisplay } from './MetricDisplay';

/**
 * StatGrid - Reusable grid layout for metrics
 *
 * A composition primitive for displaying multiple metrics in a consistent grid layout
 *
 * @param {Array} stats - Array of stat objects with shape: { icon, label, value, unit, badge, variant }
 * @param {number} columns - Number of columns (default: 2, responsive: md:4)
 * @param {string} gap - Gap size between items (default: 'gap-2')
 * @param {boolean} animate - Enable stagger animation (default: true)
 * @param {string} className - Additional classes for the grid container
 *
 * Example usage:
 * <StatGrid
 *   stats={[
 *     { icon: Activity, label: 'Pace', value: '2:30', unit: 'min/100m', variant: 'blue' },
 *     { icon: Clock, label: 'Duration', value: '45:00', unit: 'min:sec', variant: 'primary' }
 *   ]}
 *   columns={2}
 * />
 */
export const StatGrid = ({
  stats = [],
  columns = 2,
  gap = 'gap-2',
  animate = true,
  className = ''
}) => {
  // Column class mapping
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const responsiveColumns = columns <= 2
    ? `grid-cols-${columns}`
    : `grid-cols-2 md:grid-cols-${columns}`;

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const gridContent = (
    <div className={`grid ${responsiveColumns} ${gap} ${className}`}>
      {stats.map((stat, index) => (
        <MetricDisplay
          key={stat.label || index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          badge={stat.badge}
          variant={stat.variant}
          hover={stat.hover !== false}
          motionVariants={animate ? item : null}
        />
      ))}
    </div>
  );

  // Wrap with motion container if animation is enabled
  if (animate) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {gridContent}
      </motion.div>
    );
  }

  return gridContent;
};
