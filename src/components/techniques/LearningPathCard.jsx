import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ProgressBar } from '../primitives';
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
          <div className="flex items-center gap-4">
            <div className="text-3xl">{path.icon}</div>
            <div>
              <h3 className="font-display text-lg font-bold">{path.name}</h3>
              <p className="text-xs text-content-tertiary">{path.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-content-tertiary">
            <Clock className={tokens.icons.xs} />
            <span>{path.estimatedTime}</span>
          </div>
        </div>

        <p className="text-sm text-content-secondary mb-4">
          {path.description}
        </p>

        {/* Progress Bar */}
        <ProgressBar
          value={progressPercent}
          label="Progress"
          valueDisplay={`${completedCount}/${totalCount}`}
          color="primary"
          animationDelay={0.2 + index * 0.1}
          className="mb-4"
        />

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
                    flex items-center gap-2 p-3 rounded-lg
                    transition-colors cursor-pointer
                    ${isDark
                      ? 'hover:bg-dark-bg/50'
                      : 'hover:bg-white/50'
                    }
                  `}
                >
                  {completed ? (
                    <CheckCircle className={`${tokens.icons.sm} text-green-400 flex-shrink-0`} />
                  ) : (
                    <Circle className={`${tokens.icons.sm} text-content-tertiary flex-shrink-0`} />
                  )}
                  <span className={`text-xs flex-1 ${
                    completed ? 'text-content-secondary line-through' : 'text-content'
                  }`}>
                    {article.title}
                  </span>
                  <span className="text-xs text-content-tertiary">
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
            <Button
              fullWidth
              size="sm"
              rightIcon={<ArrowRight />}
            >
              Continue Path
            </Button>
          </Link>
        ) : (
          <div className={`
            w-full py-2 px-4 rounded-lg text-sm font-medium text-center
            ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-400'}
          `}>
            ✓ Path Completed!
          </div>
        )}
      </Card>
    </motion.div>
  );
};
