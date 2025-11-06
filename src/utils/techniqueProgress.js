/**
 * Technique Progress Tracking Utility
 *
 * Tracks which technique articles users have read/completed
 * Stored in localStorage for persistence
 */

const STORAGE_KEY = 'swimma_technique_progress';

/**
 * Get all completed article IDs
 * @returns {Set<string>} Set of completed article IDs
 */
export const getCompletedArticles = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch (error) {
    console.error('Error loading technique progress:', error);
    return new Set();
  }
};

/**
 * Mark an article as completed
 * @param {string} articleId - Article ID to mark as completed
 */
export const markArticleComplete = (articleId) => {
  try {
    const completed = getCompletedArticles();
    completed.add(articleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
    return true;
  } catch (error) {
    console.error('Error marking article complete:', error);
    return false;
  }
};

/**
 * Check if an article is completed
 * @param {string} articleId - Article ID to check
 * @returns {boolean} True if article is completed
 */
export const isArticleCompleted = (articleId) => {
  const completed = getCompletedArticles();
  return completed.has(articleId);
};

/**
 * Get completion percentage for a category
 * @param {Array} articles - All articles in category
 * @returns {number} Percentage completed (0-100)
 */
export const getCategoryProgress = (articles) => {
  if (!articles || articles.length === 0) return 0;
  const completed = getCompletedArticles();
  const completedCount = articles.filter(article => completed.has(article.id)).length;
  return Math.round((completedCount / articles.length) * 100);
};

/**
 * Get total progress stats
 * @param {Array} allArticles - All available articles
 * @returns {Object} Stats object with total, completed, percentage
 */
export const getTotalProgress = (allArticles) => {
  if (!allArticles || allArticles.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const completed = getCompletedArticles();
  const completedCount = allArticles.filter(article => completed.has(article.id)).length;

  return {
    total: allArticles.length,
    completed: completedCount,
    percentage: Math.round((completedCount / allArticles.length) * 100)
  };
};

/**
 * Clear all progress (for testing or reset)
 */
export const clearAllProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
};

/**
 * Get recommended next article based on completion
 * @param {Array} allArticles - All available articles
 * @returns {Object|null} Recommended article or null
 */
export const getRecommendedNextArticle = (allArticles) => {
  if (!allArticles || allArticles.length === 0) return null;

  const completed = getCompletedArticles();

  // Find first uncompleted beginner article
  const nextBeginner = allArticles.find(
    article => !completed.has(article.id) && article.level === 'beginner'
  );
  if (nextBeginner) return nextBeginner;

  // Then intermediate
  const nextIntermediate = allArticles.find(
    article => !completed.has(article.id) && article.level === 'intermediate'
  );
  if (nextIntermediate) return nextIntermediate;

  // Then advanced
  const nextAdvanced = allArticles.find(
    article => !completed.has(article.id) && article.level === 'advanced'
  );
  if (nextAdvanced) return nextAdvanced;

  // All completed!
  return null;
};
