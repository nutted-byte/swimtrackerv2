import { motion } from 'framer-motion';
import { Card } from './Card';
import { CardVariant, CardHeader, IconContainer } from './primitives';
import { Award, Lock } from 'lucide-react';
import { tokens } from '../design/tokens';

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
        className={`relative ${tokens.padding.default} ${tokens.radius.sm} border transition-all ${
          isEarned
            ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50'
            : 'bg-dark-bg/50 border-dark-border hover:border-primary-500/30'
        }`}
      >
        {/* Badge Icon */}
        <div className={`text-center ${tokens.margin.group}`}>
          <motion.div
            animate={isEarned ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
            className={tokens.margin.element}
          >
            {isEarned ? (
              <div className={`inline-flex items-center justify-center ${tokens.components.iconContainer.xl} ${tokens.radius.full} bg-yellow-500/20`}>
                <span className={tokens.typography.sizes['3xl']}>{badge.icon}</span>
              </div>
            ) : (
              <div className={`inline-flex items-center justify-center ${tokens.components.iconContainer.xl} ${tokens.radius.full} bg-dark-bg`}>
                <Lock className={`${tokens.icons.lg} text-content-tertiary`} />
              </div>
            )}
          </motion.div>

          {/* Category Badge */}
          <div className={`inline-block px-2 py-0.5 bg-dark-bg/50 rounded ${tokens.typography.sizes.xs} text-content-tertiary capitalize ${tokens.margin.element}`}>
            {badge.category}
          </div>
        </div>

        {/* Badge Info */}
        <div className={`text-center ${tokens.margin.group}`}>
          <h3 className={`${tokens.typography.weights.semibold} ${tokens.margin.element} ${isEarned ? 'text-yellow-400' : 'text-content-tertiary'}`}>
            {badge.name}
          </h3>
          <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>{badge.description}</p>
        </div>

        {/* Progress Bar (for unearned) */}
        {!isEarned && badge.progress > 0 && (
          <div className="mt-3">
            <div className={`flex items-center justify-between ${tokens.margin.element}`}>
              <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>Progress</span>
              <span className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} text-primary-400`}>
                {Math.round(badge.progress)}%
              </span>
            </div>
            <div className={`h-2 bg-dark-bg ${tokens.radius.full} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${badge.progress}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                className={`h-full bg-primary-500 ${tokens.radius.full}`}
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
            <span className={`inline-flex items-center ${tokens.gap.tight} ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} text-yellow-400`}>
              <Award className={tokens.icons.xs} />
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
        iconSize={tokens.icons.lg}
      />

      {/* Progress Overview */}
      <div className={`${tokens.margin.section} ${tokens.padding.default} bg-dark-bg/50 ${tokens.radius.sm}`}>
        <div className={`flex items-center justify-between ${tokens.margin.element}`}>
          <span className={`${tokens.typography.sizes.sm} text-content-tertiary`}>Overall Progress</span>
          <span className={`${tokens.typography.weights.semibold} text-yellow-400`}>
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className={`h-2 bg-dark-bg ${tokens.radius.full} overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            transition={{ duration: 1.5 }}
            className={`h-full bg-gradient-to-r from-yellow-600 to-yellow-400 ${tokens.radius.full}`}
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className={tokens.margin.section}>
          <h3 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-tertiary ${tokens.margin.group}`}>Unlocked</h3>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${tokens.gap.compact}`}>
            {earnedBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges */}
      {unearnedBadges.length > 0 && (
        <div>
          <h3 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-tertiary ${tokens.margin.group}`}>Locked</h3>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${tokens.gap.compact}`}>
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
