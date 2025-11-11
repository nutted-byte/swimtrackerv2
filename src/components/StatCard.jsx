import { memo } from 'react';
import { Card } from './Card';
import { TrendBadge } from './TrendBadge';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const StatCard = memo(({
  label,
  value,
  unit = '',
  // Simple mode props
  trend = null, // Number for simple mode, or string ('improving'|'stable'|'declining') for enhanced mode
  glow = false,
  // Enhanced mode props
  delta = null, // Percentage change vs previous window (enhanced mode)
  sparklineData = [], // Array of values for mini chart (enhanced mode)
  metricName = '', // For TrendBadge context (enhanced mode)
  icon: Icon = null
}) => {
  const { isDark } = useTheme();

  // Auto-detect enhanced mode based on presence of enhanced props
  const isEnhanced = sparklineData?.length > 0 || typeof trend === 'string' || metricName || delta !== null;

  // Simple mode functions
  const getTrendColor = () => {
    if (typeof trend !== 'number') return isDark ? 'text-content-tertiary' : 'text-content-tertiary';
    if (trend > 0) return 'text-accent-blue';
    if (trend < 0) return 'text-accent-coral';
    return isDark ? 'text-content-tertiary' : 'text-content-tertiary';
  };

  const getTrendSymbol = () => {
    if (typeof trend !== 'number') return '';
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '';
  };

  // Enhanced mode functions
  const getDeltaColor = () => {
    if (!delta) return 'text-content-tertiary';
    if (delta > 0) return 'text-green-400';
    if (delta < 0) return 'text-red-400';
    return 'text-content-tertiary';
  };

  const getDeltaIcon = () => {
    if (!delta || delta === 0) return null;
    return delta > 0 ? ArrowUp : ArrowDown;
  };

  const DeltaIcon = getDeltaIcon();

  // Render enhanced mode
  if (isEnhanced) {
    return (
      <Card>
        <div className="space-y-3">
          {/* Header with label and trend badge */}
          <div className="flex items-start justify-between">
            <p className="text-sm text-content-tertiary">{label}</p>
            {typeof trend === 'string' && <TrendBadge trend={trend} metric={metricName} size="sm" />}
          </div>

          {/* Value and icon */}
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold">{value}</span>
                {unit && <span className="text-lg text-content-tertiary">{unit}</span>}
              </div>
              {delta !== null && delta !== undefined && (
                <div className={`flex items-center gap-1 text-sm mt-1 ${getDeltaColor()}`}>
                  {DeltaIcon && <DeltaIcon size={14} />}
                  <span className="font-medium">
                    {delta > 0 ? '+' : ''}{delta}% vs prev
                  </span>
                </div>
              )}
            </motion.div>
            {Icon && (
              <div className="text-primary-400">
                <Icon size={28} />
              </div>
            )}
          </div>

          {/* Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-12 -mx-2 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Render simple mode (original StatCard)
  return (
    <Card glow={glow} glowColor={typeof trend === 'number' && trend > 0 ? 'blue' : 'coral'} elevated>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="stat-value">{value}</span>
            {unit && (
              <span className={`text-xl ${isDark ? 'text-content-tertiary' : 'text-content-tertiary'}`}>
                {unit}
              </span>
            )}
          </div>
          {typeof trend === 'number' && trend !== null && (
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
