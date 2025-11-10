import { motion } from 'framer-motion';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Trophy, Users, Target } from 'lucide-react';
import { tokens } from '../design/tokens';

export const SwimComparisonGrid = ({ lastSwim, comparative, formatPace }) => {
  if (!comparative) return null;

  const { vsRecent, vsPB, vsSameDistance } = comparative;

  // Comparison Card component
  const ComparisonCard = ({ title, icon: Icon, data, index }) => {
    if (!data) return null;

    const getStatusColor = (isBetter) => {
      if (isBetter === true) return 'text-accent-blue';
      if (isBetter === false) return 'text-accent-coral';
      return 'text-content-tertiary';
    };

    const getStatusIcon = (isBetter) => {
      if (isBetter === true) return TrendingUp;
      if (isBetter === false) return TrendingDown;
      return null;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="h-full">
          {/* Header */}
          <div className={`flex items-center ${tokens.gap.tight} mb-4`}>
            <div className="p-2 rounded-lg bg-dark-bg">
              <Icon className={`${tokens.icons.md} text-primary-400`} />
            </div>
            <h4 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-secondary`}>
              {title}
            </h4>
          </div>

          {/* Main comparison */}
          <div className="space-y-4">
            {/* Pace */}
            {data.paceDiff !== undefined && (
              <div>
                <p className="text-xs text-content-tertiary mb-2">Pace Difference</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const StatusIcon = getStatusIcon(data.isBetter || data.isPB);
                    return StatusIcon && (
                      <div className={getStatusColor(data.isBetter || data.isPB)}>
                        <StatusIcon className={tokens.icons.sm} />
                      </div>
                    );
                  })()}
                  <span className={`${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} ${getStatusColor(data.isBetter || data.isPB)}`}>
                    {data.paceDiff > 0 ? '+' : ''}{data.paceDiff.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-content-tertiary mt-1">
                  {data.isBetter || data.isPB
                    ? '🚀 Faster than reference'
                    : '🐢 Slower than reference'}
                </p>
              </div>
            )}

            {/* Reference pace */}
            {(data.avgPace || data.pbPace || data.bestPace) && (
              <div className="pt-3 border-t border-dark-border">
                <p className="text-xs text-content-tertiary mb-1">Reference Pace</p>
                <p className={`${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-content-secondary`}>
                  {formatPace(data.avgPace || data.pbPace || data.bestPace)}
                </p>
                <p className="text-xs text-content-tertiary mt-1">min/100m</p>
              </div>
            )}

            {/* Special badges */}
            {data.isPB && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                  <Trophy className={tokens.icons.sm} />
                  Personal Best!
                </div>
              </motion.div>
            )}

            {data.isBest && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="p-3 bg-accent-blue/10 border border-accent-blue/30 rounded-lg"
              >
                <div className="flex items-center gap-2 text-accent-blue text-sm font-semibold">
                  <Trophy className={tokens.icons.sm} />
                  Best at this distance!
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default}`}>
      {/* vs. Recent Average */}
      {vsRecent && (
        <ComparisonCard
          title="vs. Your Average"
          icon={Users}
          data={vsRecent}
          index={0}
        />
      )}

      {/* vs. Personal Best */}
      {vsPB && (
        <ComparisonCard
          title="vs. Personal Best"
          icon={Trophy}
          data={vsPB}
          index={1}
        />
      )}

      {/* vs. Same Distance */}
      {vsSameDistance && (
        <ComparisonCard
          title={`vs. Best ${(lastSwim.distance / 1000).toFixed(2)}km`}
          icon={Target}
          data={vsSameDistance}
          index={2}
        />
      )}
    </div>
  );
};
