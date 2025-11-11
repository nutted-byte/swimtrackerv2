import { motion } from 'framer-motion';

/**
 * CircularProgressBar - Reusable circular progress indicator
 *
 * Features:
 * - 7 color variants (primary, blue, orange, red, purple, green, yellow)
 * - 3 sizes (sm: 80px, md: 120px, lg: 160px)
 * - Optional label above the circle
 * - Optional custom content (overrides default percentage display)
 * - Smooth animation with customizable delay
 * - Auto-displays percentage by default
 *
 * @example
 * // Basic usage
 * <CircularProgressBar percentage={75} />
 *
 * // With label and color
 * <CircularProgressBar
 *   percentage={80}
 *   label="Monthly Goal"
 *   color="primary"
 *   size="lg"
 * />
 *
 * // With custom content
 * <CircularProgressBar
 *   percentage={90}
 *   label="Progress"
 * >
 *   <div>15/20 km</div>
 * </CircularProgressBar>
 */
export const CircularProgressBar = ({
  percentage = 0,
  label = null,
  color = 'primary',
  size = 'md',
  strokeWidth = null, // Auto-calculated if not provided
  animate = true,
  animationDelay = 0,
  children = null, // Custom content to display in center (overrides percentage display)
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { size: 80, stroke: 8, fontSize: 'text-xl' },
    md: { size: 120, stroke: 12, fontSize: 'text-3xl' },
    lg: { size: 160, stroke: 14, fontSize: 'text-4xl' }
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const circleSize = config.size;
  const circleStroke = strokeWidth || config.stroke;

  // Color configurations (matching ProgressBar colors)
  const colorConfig = {
    primary: '#6366f1', // primary-500
    blue: '#00d4ff', // accent-blue
    orange: '#fb923c', // orange-400
    red: '#f87171', // red-400
    purple: '#c084fc', // purple-400
    green: '#4ade80', // green-400
    yellow: '#facc15' // yellow-400
  };

  const strokeColor = colorConfig[color] || colorConfig.primary;

  // Calculate SVG circle properties
  const radius = (circleSize - circleStroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <p className="text-sm font-medium text-content-secondary mb-3">
          {label}
        </p>
      )}

      <div className="relative inline-flex items-center justify-center">
        <svg
          width={circleSize}
          height={circleSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={circleStroke}
            className="text-dark-border opacity-30"
          />

          {/* Progress circle */}
          {animate ? (
            <motion.circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={circleStroke}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: animationDelay
              }}
            />
          ) : (
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={circleStroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (
            <span className={`${config.fontSize} font-bold tabular-nums`}>
              {Math.round(clampedPercentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
