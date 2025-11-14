import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Sparkles, TrendingUp, Clock, Zap, Activity, Waves } from 'lucide-react';
import { IconContainer } from './primitives';
import { getAllArticles } from '../content/techniques/index.js';
import { tokens } from '../design/tokens';

export const TechniqueCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const { article, reason, priority } = recommendation;

  // Get all articles and select 3 to show
  const allArticles = getAllArticles();
  const articlesToShow = allArticles.slice(0, 3);

  // Category to icon/variant mapping
  const categoryConfig = {
    efficiency: { icon: Zap, variant: 'purple' },
    technique: { icon: Waves, variant: 'primary' },
    pacing: { icon: Activity, variant: 'accent' },
    drills: { icon: Clock, variant: 'success' }
  };

  const categoryInfo = categoryConfig[article.category] || categoryConfig.technique;

  // Priority-based styling
  const priorityStyles = {
    high: {
      gradient: 'from-accent-blue/20 to-accent-blue/5',
      border: 'border-accent-blue/30',
      badge: 'bg-accent-blue/20 text-accent-blue',
      icon: '🔥'
    },
    medium: {
      gradient: 'from-accent-blue/20 to-accent-blue/5',
      border: 'border-accent-blue/30',
      badge: 'bg-accent-blue/20 text-accent-blue',
      icon: '💡'
    },
    low: {
      gradient: 'from-primary-500/20 to-primary-500/5',
      border: 'border-primary-500/30',
      badge: 'bg-primary-500/20 text-primary-400',
      icon: '✨'
    }
  };

  const style = priorityStyles[priority] || priorityStyles.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className={`bg-gradient-to-br ${style.gradient}`}>
        <div className={`flex items-start justify-between ${tokens.margin.group}`}>
          <div className={`flex items-center ${tokens.gap.tight}`}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
            >
              <IconContainer
                icon={<categoryInfo.icon />}
                variant={categoryInfo.variant}
                size="lg"
              />
            </motion.div>
            <div>
              <div className={`flex items-center ${tokens.gap.tight} ${tokens.margin.element}`}>
                <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.bold}`}>Improve Your Swimming</h3>
                {priority === 'high' && (
                  <span className={`${tokens.typography.sizes.xs} px-2 py-0.5 ${tokens.radius.full} ${tokens.typography.weights.semibold} ${style.badge}`}>
                    Recommended
                  </span>
                )}
              </div>
              <p className={`${tokens.typography.sizes.sm} text-content-secondary`}>{reason}</p>
            </div>
          </div>
        </div>

        {/* Articles Grid - 3 Articles */}
        <div className="space-y-3">
          {articlesToShow.map((currentArticle, index) => (
            <Link
              key={currentArticle.id}
              to={`/learn/${currentArticle.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`bg-dark-bg/30 hover:bg-dark-bg/50 ${tokens.radius.sm} ${tokens.padding.default} transition-all ${tokens.animation.default} border border-transparent hover:border-primary-500/20`}
              >
                <div className={`flex items-center ${tokens.gap.tight} ${tokens.margin.element}`}>
                  <Sparkles className={`${tokens.icons.sm} text-primary-400`} />
                  <h4 className={`${tokens.typography.weights.semibold} ${tokens.typography.sizes.sm}`}>{currentArticle.title}</h4>
                </div>
                <p className={`${tokens.typography.sizes.xs} text-content-secondary mb-3 line-clamp-2`}>
                  {currentArticle.summary}
                </p>
                <div className={`flex items-center gap-4 ${tokens.typography.sizes.xs} text-content-tertiary`}>
                  <div className={`flex items-center ${tokens.gap.tight}`}>
                    <Clock className={tokens.icons.xs} />
                    <span>{currentArticle.readTime} read</span>
                  </div>
                  <div className={`flex items-center ${tokens.gap.tight}`}>
                    <TrendingUp className={tokens.icons.xs} />
                    <span className="capitalize">{currentArticle.level}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Dismissible */}
        <button
          className={`mt-4 ${tokens.typography.sizes.xs} text-content-tertiary hover:text-content-secondary transition-colors w-full text-center`}
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add dismiss functionality
            console.log('Technique tip dismissed');
          }}
        >
          Hide technique tips
        </button>
      </Card>
    </motion.div>
  );
};
