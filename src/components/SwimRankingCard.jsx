import { motion } from 'framer-motion';
import { Card } from './Card';
import { Trophy, Activity, TrendingUp, Zap } from 'lucide-react';

export const SwimRankingCard = ({ ranking }) => {
  if (!ranking) return null;

  // Get comparison message and emoji for each metric
  const getComparisonDisplay = (comparison, metric) => {
    if (!comparison) return null;

    const { status, percentDifference, isRecord } = comparison;

    // Personal record trumps everything
    if (isRecord) {
      return {
        emoji: '⭐',
        label: `Personal Best ${metric}!`,
        description: `Your best ${metric.toLowerCase()} ever`,
        colorClass: 'bg-yellow-500/20 border border-yellow-500/30'
      };
    }

    // Better than usual
    if (status === 'better') {
      return {
        emoji: '🚀',
        label: `${metric === 'Distance' ? 'Longer' : 'Faster'} Than Usual`,
        description: `${percentDifference}% ${metric === 'Distance' ? 'longer' : 'faster'} than your recent average`,
        colorClass: 'bg-green-500/20 border border-green-500/30'
      };
    }

    // Worse than usual
    if (status === 'worse') {
      return {
        emoji: metric === 'Distance' ? '📏' : '🐌',
        label: `${metric === 'Distance' ? 'Shorter' : 'Slower'} Than Usual`,
        description: `${percentDifference}% ${metric === 'Distance' ? 'shorter' : 'slower'} than your recent average`,
        colorClass: 'bg-orange-500/20 border border-orange-500/30'
      };
    }

    // Same as usual - don't show this one (reduces clutter)
    return null;
  };

  // Get display data for each metric
  const paceDisplay = ranking.pace ? getComparisonDisplay(ranking.pace, 'Pace') : null;
  const distanceDisplay = ranking.distance ? getComparisonDisplay(ranking.distance, 'Distance') : null;
  const swolfDisplay = ranking.swolf ? getComparisonDisplay(ranking.swolf, 'Efficiency') : null;

  // Filter out null displays and "same" status
  const comparisons = [
    paceDisplay && { ...paceDisplay, icon: Activity },
    distanceDisplay && { ...distanceDisplay, icon: TrendingUp },
    swolfDisplay && { ...swolfDisplay, icon: Zap }
  ].filter(Boolean);

  // If nothing interesting to show, don't render the card
  if (comparisons.length === 0) {
    return null;
  }

  // Comparison card component
  const ComparisonCard = ({ emoji, label, description, colorClass, icon: Icon, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-lg p-4 ${colorClass}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-gray-400" />
            <h4 className="font-semibold text-white">{label}</h4>
          </div>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-primary-400" />
          <div>
            <h3 className="font-display text-xl font-bold">
              How This Swim Compares
            </h3>
            <p className="text-xs text-gray-500">
              Compared to your recent swims
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-3">
          {comparisons.map((comp, index) => (
            <ComparisonCard key={index} {...comp} index={index} />
          ))}
        </div>

        {/* Month Ranking (only if top 3) */}
        {ranking.monthRank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: comparisons.length * 0.1 + 0.1 }}
            className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {ranking.monthRank === 1 ? '🥇' : ranking.monthRank === 2 ? '🥈' : '🥉'}
              </span>
              <div>
                <p className="text-sm font-semibold text-primary-400">
                  #{ranking.monthRank} This Month
                </p>
                <p className="text-xs text-gray-500">
                  Out of {ranking.monthTotal} swims in the last 30 days
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
