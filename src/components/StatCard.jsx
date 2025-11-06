import { memo } from 'react';
import { Card } from './Card';
import { useTheme } from '../context/ThemeContext';

export const StatCard = memo(({
  label,
  value,
  unit = '',
  trend = null,
  icon: Icon = null,
  glow = false
}) => {
  const { isDark } = useTheme();

  const getTrendColor = () => {
    if (!trend) return isDark ? 'text-gray-400' : 'text-slate-500';
    if (trend > 0) return 'text-accent-blue';
    if (trend < 0) return 'text-accent-coral';
    return isDark ? 'text-gray-400' : 'text-slate-500';
  };

  const getTrendSymbol = () => {
    if (!trend) return '';
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '';
  };

  return (
    <Card glow={glow} glowColor={trend > 0 ? 'blue' : 'coral'} elevated>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="stat-value">{value}</span>
            {unit && (
              <span className={`text-xl ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {unit}
              </span>
            )}
          </div>
          {trend !== null && (
            <p className={`text-sm mt-2 font-medium ${getTrendColor()}`}>
              {getTrendSymbol()} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={isDark ? 'text-primary-400' : 'text-primary-500'}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </Card>
  );
});
