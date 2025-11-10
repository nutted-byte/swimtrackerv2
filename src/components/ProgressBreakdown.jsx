import { motion } from 'framer-motion';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus, Activity, Zap, Target } from 'lucide-react';

export const ProgressBreakdown = ({ analysis }) => {
  const { status, improving, metrics } = analysis;

  const getMetricIcon = (metricName) => {
    switch (metricName) {
      case 'pace': return Activity;
      case 'swolf': return Zap;
      case 'distance': return Target;
      default: return TrendingUp;
    }
  };

  const getTrendIcon = (value, lowerIsBetter = false) => {
    if (Math.abs(value) < 2) return Minus;
    const isImproving = lowerIsBetter ? value < 0 : value > 0;
    return isImproving ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (value, lowerIsBetter = false) => {
    if (Math.abs(value) < 2) return 'text-content-tertiary';
    const isImproving = lowerIsBetter ? value < 0 : value > 0;
    return isImproving ? 'text-green-400' : 'text-red-400';
  };

  const formatTrendValue = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const breakdownMetrics = [
    {
      name: 'Pace',
      key: 'pace',
      value: metrics.trends.pace,
      lowerIsBetter: true,
      description: metrics.trends.pace > 2 ? 'Getting faster!' : metrics.trends.pace < -2 ? 'Pace slowing' : 'Pace steady'
    },
    {
      name: 'Efficiency',
      key: 'swolf',
      value: metrics.trends.swolf,
      lowerIsBetter: true,
      description: metrics.trends.swolf > 2 ? 'More efficient!' : metrics.trends.swolf < -2 ? 'Less efficient' : 'Efficiency stable'
    },
    {
      name: 'Distance',
      key: 'distance',
      value: metrics.trends.distance,
      lowerIsBetter: false,
      description: metrics.trends.distance > 2 ? 'Swimming longer!' : metrics.trends.distance < -2 ? 'Swimming shorter' : 'Distance consistent'
    }
  ];

  // Calculate comparison context
  const swimCount = metrics.totalSwims || 0;
  const halfPoint = Math.floor(swimCount / 2);
  const comparisonText = `Last ${halfPoint} swims vs previous ${halfPoint} swims`;

  return (
    <Card
      glow={improving}
      className="bg-gradient-to-br from-primary-500/10 to-accent-blue/5 border-primary-500/20"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={improving ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <span className="text-6xl">
              {status === 'improving' && '✅'}
              {status === 'stable' && '⚡'}
              {status === 'declining' && '⚠️'}
            </span>
          </motion.div>
          <h2 className={`font-display text-3xl font-bold mb-2 ${
            improving ? 'text-accent-blue' :
            status === 'declining' ? 'text-accent-coral' :
            'text-content-secondary'
          }`}>
            {status === 'improving' && "You're improving!"}
            {status === 'stable' && "Staying consistent!"}
            {status === 'declining' && "Let's refocus"}
          </h2>
          <p className="text-sm text-content-tertiary">{comparisonText}</p>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {breakdownMetrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.key);
            const TrendIcon = getTrendIcon(metric.value, metric.lowerIsBetter);
            const trendColor = getTrendColor(metric.value, metric.lowerIsBetter);

            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-content-tertiary" />
                    <span className="text-sm font-medium text-content-secondary">{metric.name}</span>
                  </div>
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-display font-bold ${trendColor}`}>
                    {formatTrendValue(metric.value)}
                  </span>
                </div>
                <p className="text-xs text-content-tertiary mt-2">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Score */}
        <div className="text-center pt-4 border-t border-dark-border/50">
          <p className="text-sm text-content-tertiary mb-1">Overall Improvement Score</p>
          <p className={`text-3xl font-display font-bold ${
            metrics.weightedScore > 0 ? 'text-green-400' :
            metrics.weightedScore < 0 ? 'text-red-400' :
            'text-content-tertiary'
          }`}>
            {metrics.weightedScore > 0 ? '+' : ''}{metrics.weightedScore}%
          </p>
          <p className="text-xs text-content-tertiary mt-1">Based on pace (40%), efficiency (40%), distance (20%)</p>
        </div>
      </div>
    </Card>
  );
};
