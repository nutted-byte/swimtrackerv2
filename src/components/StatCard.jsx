import { Card } from './Card';
import { motion } from 'framer-motion';

export const StatCard = ({
  label,
  value,
  unit = '',
  trend = null,
  icon: Icon = null,
  glow = false
}) => {
  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    if (trend > 0) return 'text-accent-blue';
    if (trend < 0) return 'text-accent-coral';
    return 'text-gray-400';
  };

  const getTrendSymbol = () => {
    if (!trend) return '';
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '';
  };

  return (
    <Card glow={glow} glowColor={trend > 0 ? 'blue' : 'coral'}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <motion.div
            className="flex items-baseline gap-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="stat-value">{value}</span>
            {unit && <span className="text-xl text-gray-400">{unit}</span>}
          </motion.div>
          {trend !== null && (
            <p className={`text-sm mt-2 ${getTrendColor()}`}>
              {getTrendSymbol()} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="text-primary-400">
            <Icon size={32} />
          </div>
        )}
      </div>
    </Card>
  );
};
