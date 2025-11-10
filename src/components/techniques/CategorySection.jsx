import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../Card';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';
import { isArticleCompleted } from '../../utils/techniqueProgress';

export const CategorySection = ({ category, articles, index, defaultOpen = false }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Calculate completion stats
  const completedCount = articles.filter(article => isArticleCompleted(article.id)).length;
  const totalCount = articles.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categoryIcons = {
    efficiency: '⚡',
    technique: '🏊',
    pacing: '⏱️',
    drills: '💪'
  };

  const categoryDescriptions = {
    efficiency: 'Learn to swim smarter, not harder. Master SWOLF and reduce effort.',
    technique: 'Perfect your form and stroke mechanics for better performance.',
    pacing: 'Strategic swimming: pace control, breathing, and race strategy.',
    drills: 'Practical workouts and drills to improve specific skills.'
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={tokens.margin.section}
    >
      <Card className={isDark ? 'bg-dark-card' : 'bg-white'}>
        {/* Category Header - Clickable */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{categoryIcons[category.id]}</div>
            <div className="text-left">
              <h2 className="font-display text-2xl font-bold flex items-center gap-3">
                {category.name}
                <span className="text-xs font-normal text-content-tertiary">
                  {completedCount}/{totalCount}
                </span>
              </h2>
              <p className="text-sm text-content-secondary mt-1">
                {categoryDescriptions[category.id]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Circle */}
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={isDark ? '#374151' : '#E5E7EB'}
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-400">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className={tokens.icons.md} />
            </motion.div>
          </div>
        </button>

        {/* Articles Grid - Collapsible */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-border">
                {articles.map((article, articleIndex) => {
                  const completed = isArticleCompleted(article.id);
                  const levelColors = isDark ? levelColorsDark : levelColorsLight;

                  return (
                    <Link
                      key={article.id}
                      to={`/learn/${article.id}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: articleIndex * 0.05 }}
                      >
                        <Card
                          hover
                          className={`h-full bg-gradient-to-br ${levelColors[article.level]} border`}
                        >
                          {completed && (
                            <div className="absolute top-3 right-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-3">
                            <div className="text-2xl">{categoryIcons[article.category]}</div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                              isDark ? 'bg-dark-bg/50 text-content-secondary' : 'bg-white/80 text-content-secondary'
                            }`}>
                              {article.level}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold mb-2">{article.title}</h3>
                          <p className="text-sm text-content-secondary mb-4 line-clamp-2">
                            {article.summary}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-content-tertiary">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                            {article.drills && article.drills.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span>{article.drills.length} drills</span>
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
