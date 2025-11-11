import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { CategoryIcon } from './ui/CategoryIcon';
import { getAllArticles } from '../content/techniques/index.js';

export const TechniqueCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const { article, reason, priority } = recommendation;

  // Get all articles and select 3 to show
  const allArticles = getAllArticles();
  const articlesToShow = allArticles.slice(0, 3);

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
      <Card className={`bg-gradient-to-br ${style.gradient} border ${style.border}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
            >
              <CategoryIcon category={article.category} size="lg" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-lg font-bold">Improve Your Swimming</h3>
                {priority === 'high' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${style.badge}`}>
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-content-secondary">{reason}</p>
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
                className="bg-dark-bg/30 hover:bg-dark-bg/50 rounded-lg p-4 transition-all duration-200 border border-transparent hover:border-primary-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <h4 className="font-semibold text-sm">{currentArticle.title}</h4>
                </div>
                <p className="text-xs text-content-secondary mb-3 line-clamp-2">
                  {currentArticle.summary}
                </p>
                <div className="flex items-center gap-4 text-xs text-content-tertiary">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{currentArticle.readTime} read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="capitalize">{currentArticle.level}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Dismissible */}
        <button
          className="mt-4 text-xs text-content-tertiary hover:text-content-secondary transition-colors w-full text-center"
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
