import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from '../Card';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';
import { isArticleCompleted } from '../../utils/techniqueProgress';

export const FeaturedArticleCard = ({ article, reason, index = 0 }) => {
  const { isDark } = useTheme();
  const completed = isArticleCompleted(article.id);

  // Use centralized difficulty styling from tokens
  const getDifficultyStyle = (level) => {
    const difficulty = tokens.components.difficulty[level] || tokens.components.difficulty.intermediate;
    return isDark
      ? `${difficulty.gradient} ${difficulty.border}`
      : `${difficulty.lightGradient} ${difficulty.lightBorder}`;
  };

  const categoryIcons = {
    efficiency: '⚡',
    technique: '🏊',
    pacing: '⏱️',
    drills: '💪'
  };

  const reasonIcons = {
    'continue-learning': '📖',
    'recommended': '✨',
    'popular': '🔥',
    'next-in-path': '🎯'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/learn/${article.id}`}>
        <Card
          hover
          className={`relative h-full bg-gradient-to-br ${getDifficultyStyle(article.level)} border transition-all duration-300`}
        >
          {/* Reason Badge */}
          {reason && (
            <div className={`
              absolute -top-3 -right-2 px-4 py-1 rounded-full text-xs font-semibold
              flex items-center gap-2
              ${isDark
                ? 'bg-primary-500 text-white'
                : 'bg-primary-600 text-white'
              }
            `}>
              {reasonIcons[reason] || <Sparkles className={tokens.icons.xs} />}
              <span>
                {reason === 'continue-learning' && 'Continue'}
                {reason === 'recommended' && 'For You'}
                {reason === 'popular' && 'Popular'}
                {reason === 'next-in-path' && 'Next Up'}
              </span>
            </div>
          )}

          {/* Completion Badge */}
          {completed && (
            <div className="absolute top-4 left-4 p-3 rounded-lg bg-green-500/20 backdrop-blur-sm">
              <CheckCircle className={`${tokens.icons.md} text-green-400`} />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{categoryIcons[article.category]}</div>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
              isDark ? 'bg-dark-bg/50 text-content-secondary' : 'bg-white/80 text-content-secondary'
            }`}>
              {article.level}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold mb-3">{article.title}</h3>
          <p className="text-sm text-content-secondary mb-4 line-clamp-4">
            {article.summary}
          </p>

          <div className="flex items-center gap-4 text-xs text-content-tertiary">
            <div className="flex items-center gap-4">
              <Clock className={tokens.icons.xs} />
              <span>{article.readTime}</span>
            </div>
            {article.drills && article.drills.length > 0 && (
              <div className="flex items-center gap-2">
                <span>💪 {article.drills.length} drills</span>
              </div>
            )}
            {article.keyTakeaways && (
              <div className="flex items-center gap-2">
                <span>✨ {article.keyTakeaways.length} takeaways</span>
              </div>
            )}
          </div>

          {/* Hover effect */}
          <motion.div
            className={`
              mt-4 pt-4 border-t flex items-center justify-between
              ${isDark ? 'border-dark-border' : 'border-slate-200'}
            `}
          >
            <span className="text-xs font-medium text-content-secondary">
              {completed ? 'Read again' : 'Start reading'}
            </span>
            <motion.div
              whileHover={{ x: 4 }}
              className="text-primary-400"
            >
              →
            </motion.div>
          </motion.div>
        </Card>
      </Link>
    </motion.div>
  );
};
