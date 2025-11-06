import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';
import { getArticle } from '../../content/techniques/index.js';
import { isArticleCompleted } from '../../utils/techniqueProgress';

export const LearningPathCard = ({ path, index }) => {
  const { isDark } = useTheme();

  // Get articles in this path
  const articles = path.articleIds.map(id => getArticle(id)).filter(Boolean);

  // Calculate progress
  const completedCount = path.articleIds.filter(id => isArticleCompleted(id)).length;
  const totalCount = path.articleIds.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Get next article to read
  const nextArticle = articles.find(article => !isArticleCompleted(article.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-shrink-0 w-80"
    >
      <Card
        hover
        className={`h-full bg-gradient-to-br ${path.color} border ${
          isDark ? 'border-dark-border' : 'border-slate-200'
        }`}
      >
        {/* Path Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{path.icon}</div>
            <div>
              <h3 className="font-display text-lg font-bold">{path.name}</h3>
              <p className="text-xs text-content-tertiary">{path.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-content-tertiary">
            <Clock className="w-3 h-3" />
            <span>{path.estimatedTime}</span>
          </div>
        </div>

        <p className="text-sm text-content-secondary mb-4">
          {path.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-content-secondary">Progress</span>
            <span className="text-xs font-bold text-primary-400">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full bg-dark-border rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-primary-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-2 mb-4">
          {articles.map((article, articleIndex) => {
            const completed = isArticleCompleted(article.id);
            return (
              <Link
                key={article.id}
                to={`/learn/${article.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg
                    transition-colors cursor-pointer
                    ${isDark
                      ? 'hover:bg-dark-bg/50'
                      : 'hover:bg-white/50'
                    }
                  `}
                >
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-content-tertiary flex-shrink-0" />
                  )}
                  <span className={`text-xs flex-1 ${
                    completed ? 'text-content-secondary line-through' : 'text-content'
                  }`}>
                    {article.title}
                  </span>
                  <span className="text-[10px] text-content-tertiary">
                    {article.readTime}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        {nextArticle ? (
          <Link to={`/learn/${nextArticle.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
            >
              Continue Path
              <ArrowRight className={tokens.icons.sm} />
            </motion.button>
          </Link>
        ) : (
          <div className={`
            w-full py-2 px-4 rounded-lg text-sm font-medium text-center
            ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'}
          `}>
            ✓ Path Completed!
          </div>
        )}
      </Card>
    </motion.div>
  );
};
