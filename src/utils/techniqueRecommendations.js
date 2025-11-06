// Technique recommendation engine
// Analyzes swim data and suggests relevant technique articles

import { getArticle, getAllArticles, learningPaths } from '../content/techniques/index.js';
import { isArticleCompleted } from './techniqueProgress';

/**
 * Analyze swim data and recommend technique articles
 * @param {Object} session - Most recent swim session
 * @param {Array} allSessions - All user sessions for comparison
 * @returns {Object} Recommendation with article, reason, and priority
 */
export const getTechniqueRecommendation = (session, allSessions = []) => {
  if (!session || allSessions.length === 0) return null;

  // Calculate averages for comparison
  const avgSwolf = allSessions
    .filter(s => s.swolf > 0)
    .reduce((sum, s) => sum + s.swolf, 0) / allSessions.filter(s => s.swolf > 0).length;

  const avgPace = allSessions
    .filter(s => s.pace > 0)
    .reduce((sum, s) => sum + s.pace, 0) / allSessions.filter(s => s.pace > 0).length;

  // Pattern 1: High SWOLF (>60) - Suggest efficiency improvement
  if (session.swolf > 60 && session.swolf > avgSwolf * 1.1) {
    return {
      article: getArticle('reduce-stroke-count'),
      reason: 'Your SWOLF is higher than average - let\'s work on efficiency',
      priority: 'high',
      pattern: 'high-swolf',
      metric: session.swolf,
      tip: 'Focus on taking fewer, more powerful strokes'
    };
  }

  // Pattern 2: Consistent high SWOLF (need fundamentals)
  if (avgSwolf > 65) {
    return {
      article: getArticle('understanding-swolf'),
      reason: 'Recommended techniques based on your swimming data',
      priority: 'high',
      pattern: 'consistent-high-swolf',
      metric: avgSwolf,
      tip: 'Understanding SWOLF is the first step to improving it'
    };
  }

  // Pattern 3: Erratic pacing (variation > 10%)
  if (allSessions.length >= 5) {
    const paceVariation = Math.max(...allSessions.slice(0, 5).map(s => s.pace)) -
                          Math.min(...allSessions.slice(0, 5).map(s => s.pace));
    const paceVariationPercent = (paceVariation / avgPace) * 100;

    if (paceVariationPercent > 10) {
      return {
        article: getArticle('consistent-pacing'),
        reason: 'Your pace varies by ' + paceVariationPercent.toFixed(0) + '% - let\'s smooth it out',
        priority: 'medium',
        pattern: 'erratic-pacing',
        metric: paceVariationPercent,
        tip: 'Consistent pacing means swimming smarter, not harder'
      };
    }
  }

  // Pattern 4: Good SWOLF but could learn fundamentals
  if (session.swolf <= 60 && session.swolf > 0) {
    return {
      article: getArticle('improve-freestyle-technique'),
      reason: 'Your efficiency is good - ready for technique refinement',
      priority: 'low',
      pattern: 'refinement',
      metric: session.swolf,
      tip: 'Take your swimming to the next level with technique work'
    };
  }

  // Pattern 5: Improving trend - positive reinforcement
  if (allSessions.length >= 10) {
    const recentSwolf = allSessions.slice(0, 5)
      .filter(s => s.swolf > 0)
      .reduce((sum, s) => sum + s.swolf, 0) / 5;
    const olderSwolf = allSessions.slice(5, 10)
      .filter(s => s.swolf > 0)
      .reduce((sum, s) => sum + s.swolf, 0) / 5;

    if (recentSwolf < olderSwolf * 0.95) {
      return {
        article: getArticle('streamline-technique'),
        reason: 'You\'re improving! Take it further with advanced techniques',
        priority: 'low',
        pattern: 'improving-trend',
        metric: ((olderSwolf - recentSwolf) / olderSwolf * 100).toFixed(1),
        tip: 'You\'ve improved ' + ((olderSwolf - recentSwolf) / olderSwolf * 100).toFixed(1) + '% - keep it up!'
      };
    }
  }

  // Default: Breathing technique (always useful)
  return {
    article: getArticle('breathing-patterns'),
    reason: 'Improve your breathing technique for better endurance',
    priority: 'low',
    pattern: 'default',
    tip: 'Bilateral breathing improves balance and technique'
  };
};

/**
 * Get multiple technique recommendations (for browsing)
 * @param {Object} userProfile - User level (beginner/intermediate/advanced)
 * @param {Array} allSessions - All user sessions
 * @returns {Array} Array of recommended articles
 */
export const getPersonalizedRecommendations = (userProfile, allSessions = []) => {
  const level = userProfile?.level || 'beginner';

  // Get primary recommendation
  const primary = getTechniqueRecommendation(allSessions[0], allSessions);

  // Get level-appropriate articles
  const recommendations = [];

  if (level === 'beginner') {
    recommendations.push(
      getArticle('understanding-swolf'),
      getArticle('improve-freestyle-technique'),
      getArticle('streamline-technique')
    );
  } else if (level === 'intermediate') {
    recommendations.push(
      getArticle('reduce-stroke-count'),
      getArticle('consistent-pacing'),
      getArticle('breathing-patterns')
    );
  } else {
    recommendations.push(
      getArticle('consistent-pacing'),
      getArticle('breathing-patterns'),
      getArticle('streamline-technique')
    );
  }

  // Remove primary from list and add it first
  if (primary) {
    const filtered = recommendations.filter(r => r.id !== primary.article.id);
    return [primary.article, ...filtered];
  }

  return recommendations;
};

/**
 * Should we show technique tips to this user?
 * Respects Wellness Mode and user preferences
 * @param {Object} userPreferences
 * @returns {boolean}
 */
export const shouldShowTechniqueTips = (userPreferences = {}) => {
  // If wellness mode is on, hide technique tips
  if (userPreferences.wellnessMode === true) {
    return false;
  }

  // If user explicitly disabled technique tips
  if (userPreferences.showTechniqueTips === false) {
    return false;
  }

  // Default: show tips
  return true;
};

/**
 * Format technique tip for display
 * @param {Object} recommendation
 * @returns {Object} Formatted tip
 */
export const formatTechniqueTip = (recommendation) => {
  if (!recommendation) return null;

  return {
    title: 'Improve Your Swimming',
    subtitle: recommendation.reason,
    article: recommendation.article,
    actionText: 'Learn More',
    actionUrl: `/techniques/${recommendation.article.id}`,
    priority: recommendation.priority,
    icon: getIconForPattern(recommendation.pattern)
  };
};

/**
 * Get icon for pattern type
 * @param {string} pattern
 * @returns {string} Emoji icon
 */
const getIconForPattern = (pattern) => {
  const icons = {
    'high-swolf': '⚡',
    'consistent-high-swolf': '📚',
    'erratic-pacing': '⏱️',
    'refinement': '✨',
    'improving-trend': '🚀',
    'default': '🏊'
  };

  return icons[pattern] || '🏊';
};

/**
 * Get quick tips based on SWOLF score
 * @param {number} swolf
 * @returns {Array} Array of quick tip strings
 */
export const getQuickTips = (swolf) => {
  if (swolf > 70) {
    return [
      'Count your strokes - aim for 18-22 per length',
      'Focus on gliding longer between strokes',
      'Work on high elbow catch technique'
    ];
  } else if (swolf > 60) {
    return [
      'Extend your glide phase for better efficiency',
      'Practice catch-up drill to improve timing',
      'Focus on completing full pull-through to hip'
    ];
  } else if (swolf > 50) {
    return [
      'Great efficiency! Work on body rotation for more power',
      'Try tempo training to build consistent rhythm',
      'Focus on streamline off walls to maximize glide'
    ];
  } else {
    return [
      'Excellent efficiency! Focus on maintaining this in faster sets',
      'Work on race pace while keeping SWOLF low',
      'Try hypoxic training to challenge yourself'
    ];
  }
};

/**
 * Get smart article recommendations for content hub based on user progress and swim data
 * @param {Array} sessions - User's swim sessions
 * @param {number} count - Number of recommendations to return
 * @returns {Array} Recommended articles with reason
 */
export const getRecommendedArticles = (sessions = [], count = 3) => {
  const allArticles = getAllArticles();
  const recommendations = [];

  // Get user's completion status
  const completedArticles = allArticles.filter(article => isArticleCompleted(article.id));
  const uncompletedArticles = allArticles.filter(article => !isArticleCompleted(article.id));

  // Rule 1: If no articles completed, recommend beginner path start
  if (completedArticles.length === 0) {
    const beginnerArticles = uncompletedArticles.filter(a => a.level === 'beginner');
    return beginnerArticles.slice(0, count).map(article => ({
      article,
      reason: 'recommended'
    }));
  }

  // Rule 2: Check user's swim data for personalized recommendations
  if (sessions && sessions.length > 0) {
    // Calculate average SWOLF
    const swolfData = sessions
      .filter(s => s.swolf && s.swolf > 0)
      .map(s => s.swolf);

    if (swolfData.length > 0) {
      const avgSwolf = swolfData.reduce((a, b) => a + b, 0) / swolfData.length;

      // If SWOLF is high (>65), recommend efficiency articles
      if (avgSwolf > 65 && !isArticleCompleted('understanding-swolf')) {
        const swolfArticle = allArticles.find(a => a.id === 'understanding-swolf');
        if (swolfArticle) {
          recommendations.push({
            article: swolfArticle,
            reason: 'recommended'
          });
        }
      }

      // If SWOLF is moderate (55-65), recommend stroke reduction
      if (avgSwolf >= 55 && avgSwolf <= 65 && !isArticleCompleted('reduce-stroke-count')) {
        const strokeArticle = allArticles.find(a => a.id === 'reduce-stroke-count');
        if (strokeArticle) {
          recommendations.push({
            article: strokeArticle,
            reason: 'recommended'
          });
        }
      }
    }

    // Check pace consistency
    if (sessions.length >= 3) {
      const recentPaces = sessions.slice(0, 5).map(s => s.pace).filter(p => p > 0);
      if (recentPaces.length >= 3) {
        const paceVariance = calculateVariance(recentPaces);
        const avgPace = recentPaces.reduce((a, b) => a + b, 0) / recentPaces.length;
        const coefficientOfVariation = Math.sqrt(paceVariance) / avgPace;

        // If pace is inconsistent (CV > 0.15), recommend pacing article
        if (coefficientOfVariation > 0.15 && !isArticleCompleted('consistent-pacing')) {
          const pacingArticle = allArticles.find(a => a.id === 'consistent-pacing');
          if (pacingArticle) {
            recommendations.push({
              article: pacingArticle,
              reason: 'recommended'
            });
          }
        }
      }
    }
  }

  // Rule 3: Find next article in partially completed paths
  for (const path of learningPaths) {
    const pathArticles = path.articleIds.map(id => allArticles.find(a => a.id === id)).filter(Boolean);
    const completedInPath = pathArticles.filter(a => isArticleCompleted(a.id));

    // If user has started this path but not finished
    if (completedInPath.length > 0 && completedInPath.length < pathArticles.length) {
      const nextArticle = pathArticles.find(a => !isArticleCompleted(a.id));
      if (nextArticle && !recommendations.find(r => r.article.id === nextArticle.id)) {
        recommendations.push({
          article: nextArticle,
          reason: 'next-in-path'
        });
      }
    }
  }

  // Rule 4: Fill remaining slots with uncompleted articles (prioritize beginner/intermediate)
  const remainingSlots = count - recommendations.length;
  if (remainingSlots > 0) {
    const priorityArticles = uncompletedArticles
      .filter(a => !recommendations.find(r => r.article.id === a.id))
      .sort((a, b) => {
        // Prioritize beginner, then intermediate, then advanced
        const levelPriority = { beginner: 0, intermediate: 1, advanced: 2 };
        return levelPriority[a.level] - levelPriority[b.level];
      });

    priorityArticles.slice(0, remainingSlots).forEach(article => {
      recommendations.push({
        article,
        reason: 'recommended'
      });
    });
  }

  return recommendations.slice(0, count);
};

/**
 * Get the next recommended article for "Start Here" button
 * @param {Array} sessions - User's swim sessions
 * @returns {string|null} Article ID or null
 */
export const getNextArticleToRead = (sessions = []) => {
  const recommendations = getRecommendedArticles(sessions, 1);
  return recommendations.length > 0 ? recommendations[0].article.id : null;
};

/**
 * Get category completion stats
 * @returns {Object} Category completion counts
 */
export const getCategoryStats = () => {
  const allArticles = getAllArticles();
  const stats = {};

  allArticles.forEach(article => {
    if (!stats[article.category]) {
      stats[article.category] = { completed: 0, total: 0 };
    }
    stats[article.category].total++;
    if (isArticleCompleted(article.id)) {
      stats[article.category].completed++;
    }
  });

  return stats;
};

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(numbers) {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}
