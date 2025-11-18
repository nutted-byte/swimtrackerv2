/**
 * Query caching utilities to reduce redundant LLM API calls
 * Caches responses in localStorage with TTL
 */

const CACHE_KEY = 'swimma_query_cache';
const CACHE_VERSION = 5; // Increment to invalidate all old caches (v5: fixed pace formatting)
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Generate cache key from question and data fingerprint
 * @param {string} question - User's question
 * @param {Array} sessions - Session data
 * @param {Object} options - Query options
 * @returns {string} Cache key
 */
const generateCacheKey = (question, sessions, options) => {
  // Create a fingerprint of the data
  const dataFingerprint = {
    count: sessions.length,
    latest: sessions[0]?.date,
    oldest: sessions[sessions.length - 1]?.date,
    maxDays: options.maxDays,
  };

  const normalizedQ = question.toLowerCase().trim();
  return `${normalizedQ}_${JSON.stringify(dataFingerprint)}`;
};

/**
 * Get cache from localStorage
 * @returns {Object} Cache object
 */
const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};

    const parsedCache = JSON.parse(cached);

    // Check cache version - invalidate if version mismatch
    if (parsedCache._version !== CACHE_VERSION) {
      console.log('Cache version mismatch - clearing old cache');
      localStorage.removeItem(CACHE_KEY);
      return {};
    }

    return parsedCache;
  } catch (err) {
    console.warn('Failed to read query cache:', err);
    return {};
  }
};

/**
 * Save cache to localStorage
 * @param {Object} cache - Cache object
 */
const saveCache = (cache) => {
  try {
    // Add version to cache object
    cache._version = CACHE_VERSION;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to save query cache:', err);
  }
};

/**
 * Get cached response if available and not expired
 * @param {string} question - User's question
 * @param {Array} sessions - Session data
 * @param {Object} options - Query options
 * @returns {Object|null} Cached response or null
 */
export const getCachedResponse = (question, sessions, options) => {
  const cacheKey = generateCacheKey(question, sessions, options);
  const cache = getCache();
  const entry = cache[cacheKey];

  if (!entry) return null;

  // Check if expired
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    // Clean up expired entry
    delete cache[cacheKey];
    saveCache(cache);
    return null;
  }

  return entry.response;
};

/**
 * Cache a query response
 * @param {string} question - User's question
 * @param {Array} sessions - Session data
 * @param {Object} options - Query options
 * @param {Object} response - Response to cache
 */
export const cacheResponse = (question, sessions, options, response) => {
  const cacheKey = generateCacheKey(question, sessions, options);
  const cache = getCache();

  // Add new entry
  cache[cacheKey] = {
    response,
    timestamp: Date.now(),
  };

  // Clean up old entries (keep only last 20)
  const entries = Object.entries(cache);
  if (entries.length > 20) {
    // Sort by timestamp, keep newest
    entries.sort(([, a], [, b]) => b.timestamp - a.timestamp);
    const newCache = {};
    entries.slice(0, 20).forEach(([key, value]) => {
      newCache[key] = value;
    });
    saveCache(newCache);
  } else {
    saveCache(cache);
  }
};

/**
 * Clear all cached queries
 */
export const clearQueryCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn('Failed to clear query cache:', err);
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export const getCacheStats = () => {
  const cache = getCache();
  const entries = Object.values(cache);

  return {
    total: entries.length,
    size: JSON.stringify(cache).length,
    oldest: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
    newest: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null,
  };
};

/**
 * Get cached swim analysis by swim ID
 * @param {string} swimId - The swim's ID
 * @returns {Object|null} Cached analysis or null
 */
export const getCachedSwimAnalysis = (swimId) => {
  const cacheKey = `swim_analysis_${swimId}`;
  const cache = getCache();
  const entry = cache[cacheKey];

  if (!entry) return null;

  // Check if expired
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    delete cache[cacheKey];
    saveCache(cache);
    return null;
  }

  return entry.response;
};

/**
 * Cache a swim analysis
 * @param {string} swimId - The swim's ID
 * @param {Object} analysis - Analysis to cache
 */
export const cacheSwimAnalysis = (swimId, analysis) => {
  const cacheKey = `swim_analysis_${swimId}`;
  const cache = getCache();

  cache[cacheKey] = {
    response: analysis,
    timestamp: Date.now(),
  };

  saveCache(cache);
};

/**
 * Get cached swim conversation
 * @param {string} swimId - The swim's ID
 * @returns {Array|null} Cached conversation or null
 */
export const getCachedSwimConversation = (swimId) => {
  const cacheKey = `swim_conversation_${swimId}`;
  const cache = getCache();
  const entry = cache[cacheKey];

  if (!entry) return null;

  // Conversation cache has longer TTL (2 hours)
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL * 2) {
    delete cache[cacheKey];
    saveCache(cache);
    return null;
  }

  return entry.conversation;
};

/**
 * Cache a swim conversation
 * @param {string} swimId - The swim's ID
 * @param {Array} conversation - Q&A conversation array
 */
export const cacheSwimConversation = (swimId, conversation) => {
  const cacheKey = `swim_conversation_${swimId}`;
  const cache = getCache();

  cache[cacheKey] = {
    conversation,
    timestamp: Date.now(),
  };

  saveCache(cache);
};
