import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from '../Tooltip';

/**
 * ComparisonBadge - Reusable comparison/performance indicator badge
 *
 * A composition primitive for showing performance comparisons (better/worse/same)
 *
 * @param {string} comparison - Type of comparison: 'better'|'worse'|'same'|'fast'|'slow'|'average'
 * @param {string|number} value - Optional value to display (e.g., "+5%", "12")
 * @param {string} label - Badge label text (e.g., "Fast", "Better", "Improved")
 * @param {string} tooltip - Optional tooltip text
 * @param {boolean} showIcon - Show trend icon (default: true)
 * @param {string} size - Badge size: 'xs'|'sm'|'md' (default: 'sm')
 * @param {string} className - Additional classes for the badge
 */
export const ComparisonBadge = ({
  comparison = 'same',
  value = null,
  label = null,
  tooltip = null,
  showIcon = true,
  size = 'sm',
  className = ''
}) => {
  // Comparison type configurations
  const comparisonStyles = {
    better: {
      icon: TrendingUp,
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      defaultLabel: 'Better'
    },
    fast: {
      icon: TrendingUp,
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      defaultLabel: 'Fast'
    },
    improved: {
      icon: TrendingUp,
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      defaultLabel: 'Improved'
    },
    worse: {
      icon: TrendingDown,
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      defaultLabel: 'Worse'
    },
    slow: {
      icon: TrendingDown,
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      defaultLabel: 'Easy'
    },
    declined: {
      icon: TrendingDown,
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      defaultLabel: 'Declined'
    },
    same: {
      icon: Minus,
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      defaultLabel: 'Same'
    },
    average: {
      icon: Minus,
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      defaultLabel: 'Average'
    },
    stable: {
      icon: Minus,
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      defaultLabel: 'Stable'
    }
  };

  // Size configurations
  const sizeClasses = {
    xs: {
      container: 'text-[9px] px-1.5 py-0.5',
      icon: 'w-3 h-3'
    },
    sm: {
      container: 'text-[10px] px-2 py-0.5',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'text-xs px-2 py-1',
      icon: 'w-4 h-4'
    }
  };

  const style = comparisonStyles[comparison] || comparisonStyles.same;
  const sizeStyle = sizeClasses[size] || sizeClasses.sm;
  const Icon = style.icon;
  const displayLabel = label || style.defaultLabel;

  const badgeContent = (
    <span className={`flex items-center gap-0.5 ${sizeStyle.container} ${style.bg} ${style.text} rounded font-medium ${className}`}>
      {showIcon && <Icon className={sizeStyle.icon} />}
      {displayLabel}
      {value && <span className="ml-0.5">{value}</span>}
    </span>
  );

  // Wrap with tooltip if provided
  if (tooltip) {
    return (
      <Tooltip content={tooltip} icon={true}>
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
};
