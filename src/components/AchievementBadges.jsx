import { motion } from 'framer-motion';
import { Card } from './Card';
import { CardHeader } from './primitives';
import { Award, Lock } from 'lucide-react';

export const AchievementBadges = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return null;
  }

  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);

  const BadgeCard = ({ badge, index }) => {
    const isEarned = badge.earned;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className={`relative p-4 rounded-lg border transition-all ${
          isEarned
            ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50'
            : 'bg-dark-bg/50 border-dark-border hover:border-primary-500/30'
        }`}
      >
        {/* Badge Icon */}
        <div className="text-center mb-4">
          <motion.div
            animate={isEarned ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
              isEarned
                ? 'bg-yellow-500/20'
                : 'bg-dark-bg'
            }`}
          >
            {isEarned ? (
              <span className="text-3xl">{badge.icon}</span>
            ) : (
              <Lock className="w-6 h-6 text-content-tertiary" />
            )}
          </motion.div>

          {/* Category Badge */}
          <div className="inline-block px-2 py-0.5 bg-dark-bg/50 rounded text-xs text-content-tertiary capitalize mb-2">
            {badge.category}
          </div>
        </div>

        {/* Badge Info */}
        <div className="text-center mb-4">
          <h3 className={`font-semibold mb-1 ${isEarned ? 'text-yellow-400' : 'text-content-tertiary'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-content-tertiary">{badge.description}</p>
        </div>

        {/* Progress Bar (for unearned) */}
        {!isEarned && badge.progress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-content-tertiary">Progress</span>
              <span className="text-xs font-semibold text-primary-400">
                {Math.round(badge.progress)}%
              </span>
            </div>
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${badge.progress}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                className="h-full bg-primary-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Earned Indicator */}
        {isEarned && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400">
              <Award className="w-3 h-3" />
              Unlocked!
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Card>
      <CardHeader
        icon={Award}
        title="Achievements"
        subtitle={`${earnedBadges.length} of ${badges.length} unlocked`}
        iconColor="text-yellow-400"
        iconBgColor="bg-yellow-500/20"
        iconSize="w-6 h-6"
      />

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-dark-bg/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-content-tertiary">Overall Progress</span>
          <span className="font-semibold text-yellow-400">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            transition={{ duration: 1.5 }}
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-content-tertiary mb-4">Unlocked</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges */}
      {unearnedBadges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-content-tertiary mb-4">Locked</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unearnedBadges.map((badge, index) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                index={earnedBadges.length + index}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
