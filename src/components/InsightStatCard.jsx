import { Card } from './Card';
import { TrendBadge } from './TrendBadge';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const InsightStatCard = ({
  label,
  value,
  unit = '',
  delta = null, // Percentage change vs previous window
  trend = null, // 'improving' | 'stable' | 'declining'
  sparklineData = [], // Array of values for mini chart
  icon: Icon = null,
  metricName = '' // For TrendBadge context
}) => {
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

  return (
    <Card>
      <div className="space-y-3">
        {/* Header with label and trend badge */}
        <div className="flex items-start justify-between">
          <p className="text-sm text-content-tertiary">{label}</p>
          {trend && <TrendBadge trend={trend} metric={metricName} size="sm" />}
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
};
