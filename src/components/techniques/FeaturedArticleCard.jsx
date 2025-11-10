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

  const levelColorsDark = {
    beginner: 'from-green-500/20 to-green-500/5 border-green-500/30',
    intermediate: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    advanced: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
  };

  const levelColorsLight = {
    beginner: 'from-green-50 to-emerald-50 border-green-200',
    intermediate: 'from-blue-50 to-cyan-50 border-blue-200',
    advanced: 'from-purple-50 to-indigo-50 border-purple-200'
  };

  const levelColors = isDark ? levelColorsDark : levelColorsLight;

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
          className={`relative h-full bg-gradient-to-br ${levelColors[article.level]} border transition-all duration-300`}
        >
          {/* Reason Badge */}
          {reason && (
            <div className={`
              absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold
              flex items-center gap-1.5 shadow-lg
              ${isDark
                ? 'bg-primary-500 text-white'
                : 'bg-primary-600 text-white'
              }
            `}>
              {reasonIcons[reason] || <Sparkles className="w-3 h-3" />}
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
            <div className="absolute top-3 left-3 p-2 rounded-lg bg-green-500/20 backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{categoryIcons[article.category]}</div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
              isDark ? 'bg-dark-bg/50 text-content-secondary' : 'bg-white/80 text-content-secondary'
            }`}>
              {article.level}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold mb-3">{article.title}</h3>
          <p className="text-sm text-content-secondary mb-4 line-clamp-3">
            {article.summary}
          </p>

          <div className="flex items-center gap-4 text-xs text-content-tertiary">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>
            {article.drills && article.drills.length > 0 && (
              <div className="flex items-center gap-1">
                <span>💪 {article.drills.length} drills</span>
              </div>
            )}
            {article.keyTakeaways && (
              <div className="flex items-center gap-1">
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
