import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { ProgressBar } from '../primitives';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';
import { categories } from '../../content/techniques/index.js';

export const TechniquesHero = ({ totalArticles, completedArticles, categoryCounts, nextArticleId }) => {
  const { isDark } = useTheme();
  const progressPercent = totalArticles > 0 ? Math.round((completedArticles / totalArticles) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={tokens.margin.hero}
    >
      <Card className={`bg-gradient-to-br ${isDark ? 'from-primary-500/20 to-primary-500/5' : 'from-primary-50 to-blue-50'} border border-primary-500/30`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left side - Title & Description */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">📚</div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  Master Your Swimming
                </h1>
                <p className="text-content-secondary text-sm mt-1">
                  Evidence-based techniques to swim faster and smarter
                </p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="mt-6">
              <ProgressBar
                value={progressPercent}
                label="Your Progress"
                valueDisplay={`${completedArticles} of ${totalArticles} completed • ${progressPercent}%`}
                color="primary"
                size="lg"
                animationDelay={0.2}
              />
            </div>

            {/* Category Quick Stats */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(cat => {
                const count = categoryCounts[cat.id] || { completed: 0, total: 0 };
                return (
                  <div
                    key={cat.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      isDark
                        ? 'bg-dark-bg/50 text-content-secondary'
                        : 'bg-white/80 text-content-secondary'
                    }`}
                  >
                    {cat.icon} {cat.name}: {count.completed}/{count.total}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side - CTA */}
          {nextArticleId && (
            <div className="flex-shrink-0">
              <Link
                to={`/learn/${nextArticleId}`}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    px-6 py-4 rounded-xl font-semibold
                    bg-primary-500 hover:bg-primary-600
                    text-white transition-colors
                    flex items-center gap-3
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Target className={tokens.icons.md} />
                    <div className="text-left">
                      <div className="text-xs opacity-90 mb-0.5">Start Here</div>
                      <div className="text-sm font-bold">Continue Learning</div>
                    </div>
                  </div>
                  <ArrowRight className={tokens.icons.sm} />
                </motion.div>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
