import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TrendBadge = memo(({ trend, metric = '', size = 'md' }) => {
  if (!trend) return null;

  const getTrendConfig = () => {
    switch (trend) {
      case 'improving':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: TrendingUp,
          label: 'Improving'
        };
      case 'declining':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: TrendingDown,
          label: 'Declining'
        };
      case 'stable':
      default:
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Minus,
          label: 'Stable'
        };
    }
  };

  const config = getTrendConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.color} ${sizeClasses[size]}`}
      title={`${metric ? `${metric} is ` : ''}${config.label.toLowerCase()}`}
    >
      <Icon size={iconSizes[size]} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
});
