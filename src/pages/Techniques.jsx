import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { Card } from '../components/Card';
import { getAllArticles, getArticle, categories, levels } from '../content/techniques/index.js';
import { ArrowLeft, Clock, TrendingUp, BookOpen, Search, Filter } from 'lucide-react';
import Markdown from 'react-markdown';
import { SwolfExplainer, StreamlineDiagram, BreathingPattern } from '../components/diagrams';

export const Techniques = () => {
  const { articleId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('Techniques component - articleId:', articleId);

  // Reset filters when navigating back to library view
  useEffect(() => {
    if (!articleId) {
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

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || article.level === selectedLevel;
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [articles, selectedCategory, selectedLevel, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title="Swimming Techniques"
        subtitle="Learn how to improve your efficiency, technique, and pacing"
      />

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-content-secondary" />
              <span className="text-sm font-medium text-content-secondary">Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-bg hover:bg-dark-card text-content-secondary'
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
                      : 'bg-dark-bg hover:bg-dark-card text-content-secondary'
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
              <TrendingUp className="w-4 h-4 text-content-secondary" />
              <span className="text-sm font-medium text-content-secondary">Level</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedLevel === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-bg hover:bg-dark-card text-content-secondary'
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
                      : 'bg-dark-bg hover:bg-dark-card text-content-secondary'
                  }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {filteredArticles.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-content-tertiary mx-auto mb-4" />
          <p className="text-content-secondary">No articles match your filters</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium"
          >
            Clear filters
          </button>
        </Card>
      )}
    </PageContainer>
  );
};

// Article Card Component
const ArticleCard = ({ article }) => {
  const levelColors = {
    beginner: 'from-green-500/20 to-green-500/5 border-green-500/30',
    intermediate: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    advanced: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
  };

  const categoryIcons = {
    efficiency: '⚡',
    technique: '🏊',
    pacing: '⏱️',
    drills: '💪'
  };

  return (
    <Link to={`/techniques/${article.id}`}>
      <Card
        hover
        className={`h-full bg-gradient-to-br ${levelColors[article.level]} border transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">{categoryIcons[article.category]}</div>
          <span className="text-[10px] px-2 py-1 bg-dark-bg/50 rounded-full font-semibold uppercase tracking-wide">
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
  console.log('ArticleView rendering with articleId:', articleId);
  const article = getArticle(articleId);
  console.log('Article found:', article ? article.title : 'null');

  useEffect(() => {
    console.log('ArticleView mounted/updated for articleId:', articleId);
    window.scrollTo(0, 0); // Scroll to top when article loads
    return () => console.log('ArticleView unmounting');
  }, [articleId]);

  if (!article) {
    return (
      <PageContainer>
        <Card className="text-center py-12">
          <p className="text-content-secondary mb-4">Article not found</p>
          <Link to="/techniques" className="text-primary-400 hover:text-primary-300">
            Back to Techniques
          </Link>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        to="/techniques"
        className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Techniques
      </Link>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">{article.title}</h1>
              <p className="text-content-secondary">{article.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-content-tertiary">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} read</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="capitalize">{article.level}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          {article.content ? (
            <>
              <Markdown
                components={{
                  h1: (props) => <h1 className="text-3xl font-bold mb-4 mt-6 text-content" {...props} />,
                  h2: (props) => <h2 className="text-2xl font-bold mb-3 mt-6 text-content" {...props} />,
                  h3: (props) => <h3 className="text-xl font-bold mb-2 mt-4 text-content" {...props} />,
                  p: (props) => <p className="mb-4 text-content-secondary leading-relaxed" {...props} />,
                  ul: (props) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />,
                  ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />,
                  li: (props) => <li className="text-content-secondary" {...props} />,
                  strong: (props) => <strong className="font-semibold text-content" {...props} />,
                  blockquote: (props) => <blockquote className="border-l-4 border-primary-500 pl-4 italic my-4 text-content-secondary" {...props} />,
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

      {/* Related Articles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <h3 className="font-display text-lg font-bold mb-4">Continue Learning</h3>
        <Link
          to="/techniques"
          className="block p-4 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors border border-dark-border"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Browse All Techniques</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </Link>
      </motion.div>
    </PageContainer>
  );
};
