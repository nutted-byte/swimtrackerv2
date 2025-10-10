import { motion } from 'framer-motion';
import { Card } from './Card';
import { Zap, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';

export const NextMilestones = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  const getIcon = (iconName) => {
    const icons = {
      Zap,
      TrendingUp,
      Target,
      Award
    };
    return icons[iconName] || Target;
  };

  const getGradientColor = (progress) => {
    if (progress >= 80) return 'from-green-500/20 to-green-500/5';
    if (progress >= 50) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-blue-500/20 to-blue-500/5';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-accent-blue';
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-500/20 rounded-lg">
          <Target className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Next Milestones</h2>
          <p className="text-sm text-gray-400">You're so close to these achievements!</p>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const Icon = getIcon(milestone.icon);

          return (
            <motion.div
              key={milestone.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg bg-gradient-to-br ${getGradientColor(milestone.progress)} border border-dark-border hover:border-primary-500/30 transition-colors`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-dark-bg/50 rounded-lg">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-xs text-gray-500">{milestone.unit}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary-400">
                  {Math.round(milestone.progress)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    className={`h-full ${getProgressColor(milestone.progress)} rounded-full`}
                  />
                </div>
              </div>

              {/* Current vs Target */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="font-display text-lg font-bold">{milestone.displayCurrent}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
                <div className="text-right">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="font-display text-lg font-bold text-primary-400">{milestone.displayTarget}</p>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-400">{milestone.message}</p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
