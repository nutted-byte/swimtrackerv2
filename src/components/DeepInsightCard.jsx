import { motion } from 'framer-motion';
import { Card } from './Card';
import {
  TrendingUp,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Zap,
  Clock,
  Calendar,
  BarChart3,
  Flame
} from 'lucide-react';

export const DeepInsightCard = ({ analysis }) => {
  if (!analysis || analysis.error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-400">No detailed analysis available</p>
        </div>
      </Card>
    );
  }

  const { pacing, fatigue, comparative, patterns, streaks, recommendations, daysSinceLastSwim } = analysis;

  const formatPace = (pace) => {
    if (!pace) return 'N/A';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-accent-coral';
      case 'medium': return 'text-yellow-400';
      case 'positive': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'positive': return CheckCircle;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Insights Header */}
      <Card className="bg-gradient-to-br from-primary-500/10 to-accent-blue/5 border-primary-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Deep Dive Analysis</h3>
            <p className="text-sm text-gray-400">AI-powered insights from your latest swim</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {comparative && (
            <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Top Percentile</p>
              <p className="font-display text-2xl font-bold text-accent-blue">
                {comparative.percentile}%
              </p>
            </div>
          )}
          {streaks?.currentStreak > 0 && (
            <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <p className="text-xs text-gray-400">Streak</p>
              </div>
              <p className="font-display text-2xl font-bold text-orange-400">
                {streaks.currentStreak}
              </p>
              <p className="text-xs text-gray-500">weeks</p>
            </div>
          )}
          {daysSinceLastSwim !== undefined && (
            <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Days Rest</p>
              <p className="font-display text-2xl font-bold text-primary-400">
                {daysSinceLastSwim}
              </p>
            </div>
          )}
          {pacing?.consistency && (
            <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Consistency</p>
              <p className="font-display text-2xl font-bold text-accent-blue">
                {pacing.consistency}%
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Pacing Analysis */}
      {pacing && pacing.strategy !== 'unknown' && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-blue/20 rounded-lg">
              <Activity className="w-6 h-6 text-accent-blue" />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-xl font-semibold mb-2">Pacing Strategy</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Strategy:</span>
                  <span className={`font-semibold capitalize ${
                    pacing.strategy === 'negative' ? 'text-green-400' :
                    pacing.strategy === 'even' ? 'text-accent-blue' :
                    pacing.strategy === 'positive' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {pacing.strategy} Split
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Pace Change:</span>
                  <span className="font-semibold">
                    {pacing.paceChange > 0 ? '+' : ''}{pacing.paceChange}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {pacing.strategy === 'negative' && 'Excellent! You got faster as you swam - ideal race pacing.'}
                  {pacing.strategy === 'even' && 'Nice consistent pace throughout your swim.'}
                  {pacing.strategy === 'positive' && 'You started fast and slowed down - watch your starting pace.'}
                  {pacing.strategy === 'erratic' && 'Your pace varied significantly - work on maintaining steady effort.'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Fatigue Analysis */}
      {fatigue && fatigue.fatigueIndex > 0 && (
        <Card>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              fatigue.fatigueIndex < 5 ? 'bg-green-400/20' :
              fatigue.fatigueIndex < 10 ? 'bg-yellow-400/20' :
              'bg-red-400/20'
            }`}>
              <BarChart3 className={`w-6 h-6 ${
                fatigue.fatigueIndex < 5 ? 'text-green-400' :
                fatigue.fatigueIndex < 10 ? 'text-yellow-400' :
                'text-red-400'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-xl font-semibold mb-2">Endurance & Fatigue</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Fatigue Index:</span>
                  <span className={`font-semibold ${
                    fatigue.fatigueIndex < 5 ? 'text-green-400' :
                    fatigue.fatigueIndex < 10 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {fatigue.fatigueIndex}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Final vs Baseline:</span>
                  <span className="font-semibold">
                    {formatPace(fatigue.finalPace)} vs {formatPace(fatigue.baselinePace)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{fatigue.description}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Comparative Performance */}
      {comparative && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-xl font-semibold mb-3">Performance Comparison</h4>
              <div className="space-y-4">
                {comparative.vsRecent && (
                  <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">vs Recent Average (10 swims)</span>
                      <span className={`text-sm font-semibold ${
                        comparative.vsRecent.isBetter ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {comparative.vsRecent.isBetter ? '🚀 Faster' : '🐢 Slower'}
                        {' '}
                        {Math.abs(comparative.vsRecent.paceDiff).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Avg: {formatPace(comparative.vsRecent.avgPace)}
                    </p>
                  </div>
                )}
                {comparative.vsPB && (
                  <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">vs Personal Best</span>
                      <span className={`text-sm font-semibold ${
                        comparative.vsPB.isPB ? 'text-yellow-400' :
                        Math.abs(comparative.vsPB.paceDiff) < 3 ? 'text-green-400' :
                        'text-gray-400'
                      }`}>
                        {comparative.vsPB.isPB ? '⭐ New PB!' :
                         `${comparative.vsPB.paceDiff > 0 ? '+' : ''}${comparative.vsPB.paceDiff.toFixed(1)}%`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PB: {formatPace(comparative.vsPB.pbPace)}
                    </p>
                  </div>
                )}
                {comparative.vsSameDistance && (
                  <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Best at This Distance</span>
                      <span className={`text-sm font-semibold ${
                        comparative.vsSameDistance.isBest ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {comparative.vsSameDistance.isBest ? '⭐ Best!' :
                         `${comparative.vsSameDistance.paceDiff > 0 ? '+' : ''}${comparative.vsSameDistance.paceDiff.toFixed(1)}%`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Best: {formatPace(comparative.vsSameDistance.bestPace)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Patterns */}
      {patterns?.hasPatterns && (patterns.bestDay || patterns.bestTime) && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-coral/20 rounded-lg">
              <Calendar className="w-6 h-6 text-accent-coral" />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-xl font-semibold mb-3">Your Peak Performance Times</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patterns.bestDay && (
                  <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Best Day</p>
                    <p className="font-display text-lg font-semibold text-accent-blue">
                      {patterns.bestDay.dayName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {formatPace(patterns.bestDay.avgPace)} ({patterns.bestDay.count} swims)
                    </p>
                  </div>
                )}
                {patterns.bestTime && (
                  <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Best Time of Day</p>
                    <p className="font-display text-lg font-semibold text-accent-blue capitalize">
                      {patterns.bestTime.time}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {formatPace(patterns.bestTime.avgPace)} ({patterns.bestTime.count} swims)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-green-400/20 rounded-lg">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="font-display text-xl font-semibold">Coach's Recommendations</h4>
              <p className="text-sm text-gray-400">Personalized tips to improve your swimming</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {recommendations.map((rec, index) => {
              const Icon = getPriorityIcon(rec.priority);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-dark-bg/50 rounded-lg border border-dark-border hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${getPriorityColor(rec.priority)}`} />
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{rec.title}</h5>
                      <p className="text-sm text-gray-400 mb-2">{rec.message}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Next Step:</span>
                        <span className="text-xs text-primary-400 font-medium">{rec.action}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
