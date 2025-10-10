import { motion } from 'framer-motion';
import { Card } from './Card';
import { Trophy, TrendingUp, Activity, Zap } from 'lucide-react';
import { tokens } from '../design/tokens';

export const SwimRankingCard = ({ ranking }) => {
  if (!ranking) return null;

  const { overallPercentile, paceRank, distanceRank, swolfRank, monthRank, monthTotal, isRecord = {}, totalSwims } = ranking;

  // Get percentile message
  const getPercentileMessage = (percentile) => {
    if (percentile >= 90) return { text: 'Elite Performance', color: 'text-yellow-400', emoji: '🌟' };
    if (percentile >= 75) return { text: 'Strong Performance', color: 'text-accent-blue', emoji: '💪' };
    if (percentile >= 50) return { text: 'Solid Performance', color: 'text-primary-400', emoji: '✅' };
    if (percentile >= 25) return { text: 'Building Performance', color: 'text-gray-400', emoji: '📈' };
    return { text: 'Keep Training', color: 'text-gray-500', emoji: '🔄' };
  };

  const percentileMsg = getPercentileMessage(overallPercentile);

  // Get medal for rank
  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  // Progress bar component
  const ProgressBar = ({ value, label, icon: Icon, rank, isRecord }) => {
    const medal = getMedal(rank);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${tokens.gap.tight} text-sm`}>
            <Icon className={`${tokens.icons.sm} ${isRecord ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={isRecord ? 'text-yellow-400 font-semibold' : 'text-gray-300'}>
              {label}
            </span>
          </div>
          <div className={`flex items-center ${tokens.gap.tight}`}>
            {medal && <span className="text-lg">{medal}</span>}
            <span className={`text-sm ${tokens.typography.weights.semibold} ${isRecord ? 'text-yellow-400' : 'text-gray-400'}`}>
              Top {value}%
            </span>
          </div>
        </div>
        <div className="relative h-2 bg-dark-bg rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className={`absolute h-full ${
              isRecord
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                : value >= 75
                ? 'bg-gradient-to-r from-accent-blue to-primary-500'
                : value >= 50
                ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`flex items-center ${tokens.gap.tight} mb-2`}>
              <Trophy className={`${tokens.icons.lg} text-yellow-400`} />
              <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold}`}>
                How This Swim Ranks
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Compared to your {totalSwims} swims
            </p>
          </div>
          <div className="text-right">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="text-3xl mb-1"
            >
              {percentileMsg.emoji}
            </motion.div>
            <p className={`text-sm font-semibold ${percentileMsg.color}`}>
              {percentileMsg.text}
            </p>
          </div>
        </div>

        {/* Overall Percentile */}
        <div className="bg-dark-bg/50 rounded-lg p-4 mb-6 border border-dark-border">
          <p className="text-sm text-gray-400 mb-2">Overall Ranking</p>
          <div className="flex items-baseline gap-2">
            <span className={`${tokens.typography.families.display} ${tokens.typography.sizes['3xl']} ${tokens.typography.weights.bold} ${percentileMsg.color}`}>
              Top {overallPercentile}%
            </span>
            <span className="text-gray-500 text-sm">of all your swims</span>
          </div>
        </div>

        {/* Month Ranking */}
        {monthRank > 0 && (
          <div className="bg-primary-500/10 rounded-lg p-4 mb-6 border border-primary-500/20">
            <p className="text-sm text-gray-400 mb-2">Last 30 Days</p>
            <div className="flex items-baseline gap-2">
              <span className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-primary-400`}>
                #{monthRank}
              </span>
              <span className="text-gray-500 text-sm">out of {monthTotal} swims this month</span>
            </div>
          </div>
        )}

        {/* Metric Rankings */}
        <div className="space-y-4">
          {ranking.pacePercentile !== null && (
            <ProgressBar
              value={ranking.pacePercentile}
              label="Pace"
              icon={Activity}
              rank={paceRank}
              isRecord={isRecord.pace}
            />
          )}

          <ProgressBar
            value={ranking.distancePercentile}
            label="Distance"
            icon={TrendingUp}
            rank={distanceRank}
            isRecord={isRecord.distance}
          />

          {ranking.swolfPercentile !== null && (
            <ProgressBar
              value={ranking.swolfPercentile}
              label="Efficiency (SWOLF)"
              icon={Zap}
              rank={swolfRank}
              isRecord={isRecord.swolf}
            />
          )}
        </div>

        {/* Records Badge */}
        {(isRecord.pace || isRecord.distance || isRecord.swolf) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg"
          >
            <div className={`flex items-center ${tokens.gap.tight} mb-2`}>
              <Trophy className={`${tokens.icons.md} text-yellow-400`} />
              <span className="font-semibold text-yellow-400">Personal Record</span>
            </div>
            <p className="text-sm text-gray-400">
              {[
                isRecord.pace && 'Pace',
                isRecord.distance && 'Distance',
                isRecord.swolf && 'Efficiency'
              ].filter(Boolean).join(', ')} in your top 3!
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
