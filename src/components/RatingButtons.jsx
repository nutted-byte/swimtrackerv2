import { motion } from 'framer-motion';
import { tokens } from '../design/tokens';

/**
 * Rating buttons component for manually rating swim sessions
 * Allows users to rate as Good, Average, or Bad
 */
export const RatingButtons = ({ currentRating, onRate, size = 'md', className = '' }) => {
  const ratings = [
    { value: 'good', label: 'Good', color: 'green', bg: 'bg-green-500' },
    { value: 'average', label: 'Average', color: 'yellow', bg: 'bg-yellow-500' },
    { value: 'bad', label: 'Bad', color: 'red', bg: 'bg-red-500' }
  ];

  const sizeClasses = {
    sm: { button: 'p-1.5', circle: 'w-4 h-4' },
    md: { button: 'p-2', circle: 'w-5 h-5' },
    lg: { button: 'p-2.5', circle: 'w-6 h-6' }
  };

  const handleClick = (value) => {
    // If clicking the already-selected rating, clear it (set to null)
    if (currentRating === value) {
      onRate(null);
    } else {
      onRate(value);
    }
  };

  const getButtonStyles = (rating) => {
    const isSelected = currentRating === rating.value;

    const colorMap = {
      green: {
        bg: 'bg-transparent hover:bg-green-500/10',
        selected: 'bg-green-500/20'
      },
      yellow: {
        bg: 'bg-transparent hover:bg-yellow-500/10',
        selected: 'bg-yellow-500/20'
      },
      red: {
        bg: 'bg-transparent hover:bg-red-500/10',
        selected: 'bg-red-500/20'
      }
    };

    const colors = colorMap[rating.color];

    return `
      ${tokens.radius.full}
      ${sizeClasses[size].button}
      ${isSelected ? colors.selected : colors.bg}
      transition-all
      ${tokens.animation.default}
      cursor-pointer
      hover:scale-105
      active:scale-95
    `;
  };

  return (
    <div className={`flex items-center ${tokens.gap.tight} ${className}`}>
      <span className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.medium} text-content-tertiary mr-2`}>
        Rate your swim
      </span>
      {ratings.map((rating, index) => (
        <motion.button
          key={rating.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleClick(rating.value)}
          className={getButtonStyles(rating)}
          title={rating.label}
          aria-label={`Rate swim as ${rating.label}`}
        >
          <div className={`${sizeClasses[size].circle} ${rating.bg} ${tokens.radius.full}`} />
        </motion.button>
      ))}
      {currentRating && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onRate(null)}
          className={`
            ${tokens.typography.sizes.xs}
            ${tokens.typography.weights.medium}
            text-content-tertiary
            hover:text-content
            underline
            ml-2
            transition-colors
          `}
          title="Clear rating"
        >
          Clear
        </motion.button>
      )}
    </div>
  );
};
