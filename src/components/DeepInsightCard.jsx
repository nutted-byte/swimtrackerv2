import { motion } from 'framer-motion';
import { CardVariant, IconContainer } from './primitives';
import { tokens } from '../design/tokens';
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
      <CardVariant variant="primary">
        <div className="text-center py-8">
          <p className="text-content-tertiary">No detailed analysis available</p>
        </div>
      </CardVariant>
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
      default: return 'text-content-tertiary';
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
      <CardVariant variant="primary" className="bg-gradient-to-br from-primary-500/10 to-accent-blue/5 border-primary-500/20">
        <div className={`flex items-center ${tokens.gap.tight} ${tokens.margin.group}`}>
          <IconContainer
            icon={<Zap />}
            variant="primary"
            size="lg"
            rounded
          />
          <div>
            <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>Deep Dive Analysis</h3>
            <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>AI-powered insights from your latest swim</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.gap.default} ${tokens.margin.section}`}>
          {comparative && (
            <div className={`text-center ${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
              <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>Top Percentile</p>
              <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
                {comparative.percentile}%
              </p>
            </div>
          )}
          {streaks?.currentStreak > 0 && (
            <div className={`text-center ${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
              <div className={`flex items-center justify-center ${tokens.gap.element} ${tokens.margin.element}`}>
                <Flame className={`${tokens.icons.xs} text-orange-400`} />
                <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>Streak</p>
              </div>
              <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-orange-400`}>
                {streaks.currentStreak}
              </p>
              <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>weeks</p>
            </div>
          )}
          {daysSinceLastSwim !== undefined && (
            <div className={`text-center ${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
              <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>Days Rest</p>
              <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-primary-400`}>
                {daysSinceLastSwim}
              </p>
            </div>
          )}
          {pacing?.consistency && (
            <div className={`text-center ${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
              <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>Consistency</p>
              <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
                {pacing.consistency}%
              </p>
            </div>
          )}
        </div>
      </CardVariant>

      {/* Pacing Analysis */}
      {pacing && pacing.strategy !== 'unknown' && (
        <CardVariant variant="primary">
          <div className={`flex items-start ${tokens.gap.default}`}>
            <IconContainer
              icon={<Activity />}
              variant="accent"
              size="lg"
            />
            <div className="flex-1">
              <h4 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold} ${tokens.margin.element}`}>Pacing Strategy</h4>
              <div className="space-y-2">
                <div className={`flex items-center ${tokens.gap.tight}`}>
                  <span className="text-content-tertiary">Strategy:</span>
                  <span className={`${tokens.typography.weights.semibold} capitalize ${
                    pacing.strategy === 'negative' ? 'text-green-400' :
                    pacing.strategy === 'even' ? 'text-accent-blue' :
                    pacing.strategy === 'positive' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {pacing.strategy} Split
                  </span>
                </div>
                <div className={`flex items-center ${tokens.gap.tight}`}>
                  <span className="text-content-tertiary">Pace Change:</span>
                  <span className={tokens.typography.weights.semibold}>
                    {pacing.paceChange > 0 ? '+' : ''}{pacing.paceChange}%
                  </span>
                </div>
                <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.element}`}>
                  {pacing.strategy === 'negative' && 'Excellent! You got faster as you swam - ideal race pacing.'}
                  {pacing.strategy === 'even' && 'Nice consistent pace throughout your swim.'}
                  {pacing.strategy === 'positive' && 'You started fast and slowed down - watch your starting pace.'}
                  {pacing.strategy === 'erratic' && 'Your pace varied significantly - work on maintaining steady effort.'}
                </p>
              </div>
            </div>
          </div>
        </CardVariant>
      )}

      {/* Fatigue Analysis */}
      {fatigue && fatigue.fatigueIndex > 0 && (
        <CardVariant variant="primary">
          <div className={`flex items-start ${tokens.gap.default}`}>
            <IconContainer
              icon={<BarChart3 />}
              variant={
                fatigue.fatigueIndex < 5 ? 'success' :
                fatigue.fatigueIndex < 10 ? 'warning' :
                'warning'
              }
              size="lg"
            />
            <div className="flex-1">
              <h4 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold} ${tokens.margin.element}`}>Endurance & Fatigue</h4>
              <div className="space-y-2">
                <div className={`flex items-center ${tokens.gap.tight}`}>
                  <span className="text-content-tertiary">Fatigue Index:</span>
                  <span className={`${tokens.typography.weights.semibold} ${
                    fatigue.fatigueIndex < 5 ? 'text-green-400' :
                    fatigue.fatigueIndex < 10 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {fatigue.fatigueIndex}%
                  </span>
                </div>
                <div className={`flex items-center ${tokens.gap.tight}`}>
                  <span className="text-content-tertiary">Final vs Baseline:</span>
                  <span className={tokens.typography.weights.semibold}>
                    {formatPace(fatigue.finalPace)} vs {formatPace(fatigue.baselinePace)}
                  </span>
                </div>
                <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.element}`}>{fatigue.description}</p>
              </div>
            </div>
          </div>
        </CardVariant>
      )}

      {/* Comparative Performance */}
      {comparative && (
        <CardVariant variant="primary">
          <div className={`flex items-start ${tokens.gap.default}`}>
            <IconContainer
              icon={<TrendingUp />}
              variant="primary"
              size="lg"
            />
            <div className="flex-1">
              <h4 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold} ${tokens.margin.tight}`}>Performance Comparison</h4>
              <div className="space-y-4">
                {comparative.vsRecent && (
                  <div className={`${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
                    <div className={`flex items-center justify-between ${tokens.margin.element}`}>
                      <span className={`${tokens.typography.sizes.sm} text-content-tertiary`}>vs Recent Average (10 swims)</span>
                      <span className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} ${
                        comparative.vsRecent.isBetter ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {comparative.vsRecent.isBetter ? '🚀 Faster' : '🐢 Slower'}
                        {' '}
                        {Math.abs(comparative.vsRecent.paceDiff).toFixed(1)}%
                      </span>
                    </div>
                    <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                      Avg: {formatPace(comparative.vsRecent.avgPace)}
                    </p>
                  </div>
                )}
                {comparative.vsPB && (
                  <div className={`${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
                    <div className={`flex items-center justify-between ${tokens.margin.element}`}>
                      <span className={`${tokens.typography.sizes.sm} text-content-tertiary`}>vs Personal Best</span>
                      <span className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} ${
                        comparative.vsPB.isPB ? 'text-yellow-400' :
                        Math.abs(comparative.vsPB.paceDiff) < 3 ? 'text-green-400' :
                        'text-content-tertiary'
                      }`}>
                        {comparative.vsPB.isPB ? '⭐ New PB!' :
                         `${comparative.vsPB.paceDiff > 0 ? '+' : ''}${comparative.vsPB.paceDiff.toFixed(1)}%`}
                      </span>
                    </div>
                    <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                      PB: {formatPace(comparative.vsPB.pbPace)}
                    </p>
                  </div>
                )}
                {comparative.vsSameDistance && (
                  <div className={`${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
                    <div className={`flex items-center justify-between ${tokens.margin.element}`}>
                      <span className={`${tokens.typography.sizes.sm} text-content-tertiary`}>Best at This Distance</span>
                      <span className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} ${
                        comparative.vsSameDistance.isBest ? 'text-yellow-400' : 'text-content-tertiary'
                      }`}>
                        {comparative.vsSameDistance.isBest ? '⭐ Best!' :
                         `${comparative.vsSameDistance.paceDiff > 0 ? '+' : ''}${comparative.vsSameDistance.paceDiff.toFixed(1)}%`}
                      </span>
                    </div>
                    <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                      Best: {formatPace(comparative.vsSameDistance.bestPace)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardVariant>
      )}

      {/* Performance Patterns */}
      {patterns?.hasPatterns && (patterns.bestDay || patterns.bestTime) && (
        <CardVariant variant="primary">
          <div className={`flex items-start ${tokens.gap.default}`}>
            <IconContainer
              icon={<Calendar />}
              variant="warning"
              size="lg"
            />
            <div className="flex-1">
              <h4 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold} ${tokens.margin.tight}`}>Your Peak Performance Times</h4>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.gap.default}`}>
                {patterns.bestDay && (
                  <div className={`${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
                    <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.element}`}>Best Day</p>
                    <p className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-accent-blue`}>
                      {patterns.bestDay.dayName}
                    </p>
                    <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>
                      Avg: {formatPace(patterns.bestDay.avgPace)} ({patterns.bestDay.count} swims)
                    </p>
                  </div>
                )}
                {patterns.bestTime && (
                  <div className={`${tokens.padding.tight} bg-dark-bg/50 ${tokens.radius.md}`}>
                    <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.element}`}>Best Time of Day</p>
                    <p className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-accent-blue capitalize`}>
                      {patterns.bestTime.time}
                    </p>
                    <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>
                      Avg: {formatPace(patterns.bestTime.avgPace)} ({patterns.bestTime.count} swims)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardVariant>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <CardVariant variant="primary">
          <div className={`flex items-start ${tokens.gap.default} ${tokens.margin.group}`}>
            <IconContainer
              icon={<Award />}
              variant="success"
              size="lg"
            />
            <div>
              <h4 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold}`}>Coach's Recommendations</h4>
              <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>Personalized tips to improve your swimming</p>
            </div>
          </div>

          <div className={`space-y-3 ${tokens.margin.group}`}>
            {recommendations.map((rec, index) => {
              const Icon = getPriorityIcon(rec.priority);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${tokens.padding.default} bg-dark-bg/50 ${tokens.radius.md} transition-colors`}
                >
                  <div className={`flex items-start ${tokens.gap.tight}`}>
                    <Icon className={`${tokens.icons.md} mt-0.5 ${getPriorityColor(rec.priority)}`} />
                    <div className="flex-1">
                      <h5 className={`${tokens.typography.weights.semibold} ${tokens.margin.element}`}>{rec.title}</h5>
                      <p className={`${tokens.typography.sizes.sm} text-content-tertiary ${tokens.margin.element}`}>{rec.message}</p>
                      <div className={`flex items-center ${tokens.gap.element}`}>
                        <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>Next Step:</span>
                        <span className={`${tokens.typography.sizes.xs} text-primary-400 font-medium`}>{rec.action}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardVariant>
      )}
    </div>
  );
};
