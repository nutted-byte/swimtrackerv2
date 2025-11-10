import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { Card } from '../components/Card';
import { getAllArticles, getArticle, categories, levels, learningPaths } from '../content/techniques/index.js';
import { ArrowLeft, Clock, TrendingUp, BookOpen, Search, Filter, Share2, CheckCircle, ChevronRight, Home, Lightbulb, AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown';
import { SwolfExplainer, StreamlineDiagram, BreathingPattern } from '../components/diagrams';
import { useTheme } from '../context/ThemeContext';
import { useSwimData } from '../context/SwimDataContext';
import { markArticleComplete, isArticleCompleted } from '../utils/techniqueProgress';
import { getRecommendedArticles, getNextArticleToRead, getCategoryStats } from '../utils/techniqueRecommendations';
import { TechniquesHero } from '../components/techniques/TechniquesHero';
import { LearningPathCard } from '../components/techniques/LearningPathCard';
import { FeaturedArticleCard } from '../components/techniques/FeaturedArticleCard';
import { CategorySection } from '../components/techniques/CategorySection';
import { tokens } from '../design/tokens';

export const Techniques = () => {
  const { isDark } = useTheme();
  const { articleId } = useParams();
  const { sessions } = useSwimData();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('Techniques component - articleId:', articleId);

  // Reset filters when navigating back to library view
  useEffect(() => {
    if (!articleId) {
      setShowFilters(false);
      setSelectedCategory('all');
      setSelectedLevel('all');
      setSearchQuery('');
    }
  }, [articleId]);

  // If viewing specific article
  if (articleId) {
    return <ArticleView articleId={articleId} key={articleId} />;
  }

  // Library view
  const articles = getAllArticles();
  console.log('Techniques library - articles count:', articles.length);

  // Get completion stats
  const completedArticles = articles.filter(article => isArticleCompleted(article.id));
  const categoryCounts = getCategoryStats();
  const nextArticleId = getNextArticleToRead(sessions);

  // Get recommendations
  const recommendations = useMemo(() => getRecommendedArticles(sessions, 3), [sessions]);

  // Group articles by category for sections
  const articlesByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach(cat => {
      grouped[cat.id] = articles.filter(article => article.category === cat.id);
    });
    return grouped;
  }, [articles]);

  // Filter articles (for search/filter mode)
  const filteredArticles = useMemo(() => {
    if (!showFilters && searchQuery === '' && selectedCategory === 'all' && selectedLevel === 'all') {
      return articles;
    }
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || article.level === selectedLevel;
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [articles, selectedCategory, selectedLevel, searchQuery, showFilters]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery !== '';

  return (
    <PageContainer>
      {/* Hero Section */}
      <TechniquesHero
        totalArticles={articles.length}
        completedArticles={completedArticles.length}
        categoryCounts={categoryCounts}
        nextArticleId={nextArticleId}
      />

      {/* Recommended For You Section */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={tokens.margin.section}
        >
          <h2 className="font-display text-2xl font-bold mb-4">
            {completedArticles.length > 0 ? 'Continue Learning' : 'Start Here'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <FeaturedArticleCard
                key={rec.article.id}
                article={rec.article}
                reason={rec.reason}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Learning Paths Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={tokens.margin.section}
      >
        <h2 className="font-display text-2xl font-bold mb-4">Learning Paths</h2>
        <p className="text-content-secondary mb-6">Guided journeys to master specific skills</p>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {learningPaths.map((path, index) => (
            <LearningPathCard key={path.id} path={path} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Search & Filters - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={tokens.margin.section}
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="font-display text-2xl font-bold">
            {showFilters ? 'Search & Filter' : 'Explore by Category'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-content-tertiary">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Hide filters' : 'Show search'}</span>
          </div>
        </button>

        {showFilters && (
          <Card className="mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
              <input
                type="text"
                placeholder="Search techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg border transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50
                  ${isDark
                    ? 'bg-dark-bg border-dark-border text-white placeholder-gray-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }
                `}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-content-secondary">Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-500 text-white'
                      : isDark
                        ? 'bg-dark-bg hover:bg-dark-card text-content-secondary'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-500 text-white'
                        : isDark
                          ? 'bg-dark-bg hover:bg-dark-card text-content-secondary'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-content-secondary">Level</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === 'all'
                      ? 'bg-primary-500 text-white'
                      : isDark
                        ? 'bg-dark-bg hover:bg-dark-card text-content-secondary'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  All Levels
                </button>
                {levels.map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === lvl.id
                        ? 'bg-primary-500 text-white'
                        : isDark
                          ? 'bg-dark-bg hover:bg-dark-card text-content-secondary'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {lvl.name}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </Card>
        )}

        {/* Show filtered results if filters are active */}
        {hasActiveFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        )}

        {hasActiveFilters && filteredArticles.length === 0 && (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-content-tertiary mx-auto mb-4" />
            <p className="text-content-secondary">No articles match your filters</p>
          </Card>
        )}
      </motion.div>

      {/* Category Sections - Only show if no active filters */}
      {!hasActiveFilters && (
        <div>
          {categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              articles={articlesByCategory[category.id] || []}
              index={index}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

// Article Card Component
const ArticleCard = ({ article }) => {
  const { isDark } = useTheme();

  const levelColorsDark = {
    beginner: 'from-green-500/20 to-green-500/5 border-green-500/30',
    intermediate: 'from-primary-50 to-blue-50 border-primary-200',
    advanced: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
  };

  const levelColorsLight = {
    beginner: 'from-green-50 to-emerald-50 border-green-200',
    intermediate: 'from-primary-50 to-blue-50 border-primary-200',
    advanced: 'from-purple-50 to-indigo-50 border-purple-200'
  };

  const levelColors = isDark ? levelColorsDark : levelColorsLight;

  const categoryIcons = {
    efficiency: '⚡',
    technique: '🏊',
    pacing: '⏱️',
    drills: '💪'
  };

  return (
    <Link to={`/learn/${article.id}`}>
      <Card
        hover
        className={`h-full bg-gradient-to-br ${levelColors[article.level]} border transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">{categoryIcons[article.category]}</div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
            isDark ? 'bg-dark-bg/50 text-gray-300' : 'bg-white/80 text-slate-700'
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
          {article.drills && (
            <div className="flex items-center gap-1">
              <span>{article.drills.length} drills included</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

// Article Detail View
const ArticleView = ({ articleId }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  console.log('ArticleView rendering with articleId:', articleId);
  const article = getArticle(articleId);
  const allArticles = getAllArticles();
  console.log('Article found:', article ? article.title : 'null');

  useEffect(() => {
    console.log('ArticleView mounted/updated for articleId:', articleId);
    window.scrollTo(0, 0);
    setIsCompleted(isArticleCompleted(articleId));

    // Track reading progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / scrollableHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Mark as complete when user scrolls to 80%
      if (progress > 80 && !isCompleted) {
        markArticleComplete(articleId);
        setIsCompleted(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      console.log('ArticleView unmounting');
    };
  }, [articleId, isCompleted]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) {
    return (
      <PageContainer>
        <Card className="text-center py-12">
          <p className="text-content-secondary mb-4">Article not found</p>
          <Link to="/learn" className="text-primary-400 hover:text-primary-300">
            Back to Learn
          </Link>
        </Card>
      </PageContainer>
    );
  }

  // Get category info
  const categoryInfo = categories.find(cat => cat.id === article.category);

  // Get related articles (same category, different level)
  const relatedArticles = allArticles
    .filter(a =>
      a.id !== article.id &&
      a.category === article.category &&
      a.level !== article.level
    )
    .slice(0, 3);

  const levelColorsDark = {
    beginner: 'from-green-500/20 to-green-500/5',
    intermediate: 'from-primary-50 to-blue-50',
    advanced: 'from-purple-500/20 to-purple-500/5'
  };

  const levelColorsLight = {
    beginner: 'from-green-50 to-emerald-50',
    intermediate: 'from-primary-50 to-blue-50',
    advanced: 'from-purple-50 to-indigo-50'
  };

  return (
    <PageContainer>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-dark-border z-50">
        <motion.div
          className="h-full bg-primary-500"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-content-tertiary mb-6">
        <Link to="/" className="hover:text-content transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/learn" className="hover:text-content transition-colors">
          Learn
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-secondary">{categoryInfo?.name || article.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content">{article.title}</span>
      </div>

      {/* Hero Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className={`
          bg-gradient-to-br ${isDark ? levelColorsDark[article.level] : levelColorsLight[article.level]}
          rounded-2xl p-8 md:p-12 border
          ${isDark ? 'border-dark-border' : 'border-slate-200'}
        `}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{categoryInfo?.icon || '📚'}</span>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                    isDark ? 'bg-dark-bg/50 text-gray-300' : 'bg-white/80 text-slate-700'
                  }`}>
                    {article.level}
                  </span>
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
              <p className="text-lg text-content-secondary max-w-3xl">{article.summary}</p>
            </div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">Completed</span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-content-secondary">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} read</span>
            </div>
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-dark-bg/50 hover:bg-dark-bg text-content-secondary hover:text-content'
                  : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="prose prose-slate dark:prose-invert max-w-none">
          {article.content ? (
            <>
              <Markdown
                components={{
                  h1: (props) => <h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0 text-content" {...props} />,
                  h2: (props) => <h2 className="text-2xl font-bold mb-4 mt-8 text-content border-b border-dark-border pb-2" {...props} />,
                  h3: (props) => <h3 className="text-xl font-bold mb-3 mt-6 text-content" {...props} />,
                  p: (props) => {
                    const text = props.children?.toString() || '';

                    // Pro Tip callout
                    if (text.startsWith('**Think:**') || text.startsWith('**Pro tip:**') || text.startsWith('**The Golden Rule:**')) {
                      return (
                        <div className={`my-6 p-4 rounded-lg border-l-4 ${
                          isDark
                            ? 'bg-blue-500/10 border-blue-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}>
                          <div className="flex gap-3">
                            <Lightbulb className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <p className="mb-0 text-content-secondary leading-relaxed" {...props} />
                          </div>
                        </div>
                      );
                    }

                    // Common Mistakes callout
                    if (text.startsWith('**Common mistakes:**') || text.includes('❌')) {
                      return (
                        <div className={`my-6 p-4 rounded-lg border-l-4 ${
                          isDark
                            ? 'bg-orange-500/10 border-orange-500'
                            : 'bg-orange-50 border-orange-500'
                        }`}>
                          <div className="flex gap-3">
                            <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              isDark ? 'text-orange-400' : 'text-orange-600'
                            }`} />
                            <p className="mb-0 text-content-secondary leading-relaxed" {...props} />
                          </div>
                        </div>
                      );
                    }

                    return <p className="mb-4 text-content-secondary leading-relaxed text-base" {...props} />;
                  },
                  ul: (props) => <ul className="list-disc list-outside mb-6 space-y-2 ml-6" {...props} />,
                  ol: (props) => <ol className="list-decimal list-outside mb-6 space-y-2 ml-6" {...props} />,
                  li: (props) => <li className="text-content-secondary leading-relaxed" {...props} />,
                  strong: (props) => <strong className="font-semibold text-content" {...props} />,
                  blockquote: (props) => (
                    <blockquote className={`border-l-4 border-primary-500 pl-6 py-2 my-6 italic ${
                      isDark ? 'bg-primary-500/5' : 'bg-primary-50'
                    }`} {...props} />
                  ),
                  code: (props) => (
                    <code className={`px-2 py-1 rounded text-sm font-mono ${
                      isDark ? 'bg-dark-bg text-primary-400' : 'bg-slate-100 text-primary-600'
                    }`} {...props} />
                  ),
                }}
              >
                {article.content.trim()}
              </Markdown>

              {/* Contextual Diagrams */}
              {articleId === 'understanding-swolf' && <SwolfExplainer />}
              {articleId === 'streamline-technique' && <StreamlineDiagram />}
              {(articleId === 'breathing-technique' || articleId === 'bilateral-breathing') && (
                <BreathingPattern pattern="bilateral" />
              )}
            </>
          ) : (
            <p className="text-content-secondary">No content available</p>
          )}
        </Card>
      </motion.div>

      {/* Key Takeaways */}
      {article.keyTakeaways && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/30">
            <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
              <span>✨</span> Key Takeaways
            </h3>
            <ul className="space-y-2">
              {article.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span className="text-content-secondary">{takeaway}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Drills */}
      {article.drills && article.drills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <Card>
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <span>💪</span> Practice Drills
            </h3>
            <div className="space-y-4">
              {article.drills.map((drill, index) => (
                <div key={index} className="p-4 bg-dark-bg rounded-lg">
                  <h4 className="font-semibold mb-1">{drill.name}</h4>
                  <p className="text-sm text-content-secondary mb-2">{drill.description}</p>
                  <div className="flex items-center gap-4 text-xs text-content-tertiary">
                    <span>📏 {drill.distance}</span>
                    <span>🎯 Focus: {drill.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Related Articles Widget */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="font-display text-2xl font-bold mb-6">
            {relatedArticles.length > 0 ? 'If you liked this, try...' : 'Continue Learning'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {relatedArticles.map((related, index) => {
              const relatedLevelColors = isDark ? {
                beginner: 'from-green-500/20 to-green-500/5 border-green-500/30',
                intermediate: 'from-primary-50 to-blue-50 border-primary-200',
                advanced: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
              } : {
                beginner: 'from-green-50 to-emerald-50 border-green-200',
                intermediate: 'from-primary-50 to-blue-50 border-primary-200',
                advanced: 'from-purple-50 to-indigo-50 border-purple-200'
              };

              const categoryIcons = {
                efficiency: '⚡',
                technique: '🏊',
                pacing: '⏱️',
                drills: '💪'
              };

              return (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/learn/${related.id}`}>
                    <Card
                      hover
                      className={`h-full bg-gradient-to-br ${relatedLevelColors[related.level]} border`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{categoryIcons[related.category]}</div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                          isDark ? 'bg-dark-bg/50 text-gray-300' : 'bg-white/80 text-slate-700'
                        }`}>
                          {related.level}
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold mb-2">{related.title}</h4>
                      <p className="text-xs text-content-tertiary line-clamp-2 mb-3">
                        {related.summary}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-content-tertiary">
                        <Clock className="w-3 h-3" />
                        <span>{related.readTime}</span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Back to Learn */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6"
      >
        <Link
          to="/learn"
          className={`block p-4 rounded-lg transition-colors border ${
            isDark
              ? 'bg-dark-card hover:bg-dark-card/80 border-dark-border'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Browse All Articles</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </Link>
      </motion.div>
    </PageContainer>
  );
};
