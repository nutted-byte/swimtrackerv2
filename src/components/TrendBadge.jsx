import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const TrendBadge = memo(({ trend, metric = '', size = 'md' }) => {
  const { isDark } = useTheme();

  if (!trend) return null;

  const getTrendConfig = () => {
    switch (trend) {
      case 'improving':
        return {
          colorDark: 'bg-green-500/20 text-green-400 border-green-500/30',
          colorLight: 'bg-green-50 text-green-400 border-green-200',
          icon: TrendingUp,
          label: 'Improving'
        };
      case 'declining':
        return {
          colorDark: 'bg-red-500/20 text-red-400 border-red-500/30',
          colorLight: 'bg-red-50 text-red-700 border-red-200',
          icon: TrendingDown,
          label: 'Declining'
        };
      case 'stable':
      default:
        return {
          colorDark: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          colorLight: 'bg-yellow-50 text-yellow-700 border-yellow-200',
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

  const colorClass = isDark ? config.colorDark : config.colorLight;

  return (
    <div
      className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClasses[size]}`}
      title={`${metric ? `${metric} is ` : ''}${config.label.toLowerCase()}`}
    >
      <Icon size={iconSizes[size]} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
});
