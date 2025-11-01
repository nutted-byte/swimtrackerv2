// Technique recommendation engine
// Analyzes swim data and suggests relevant technique articles

import { getArticle } from '../content/techniques/index.js';

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
