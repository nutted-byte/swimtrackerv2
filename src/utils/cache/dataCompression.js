/**
 * Data compression utilities for efficient LLM context
 * Compresses swim session data into minimal representations for API calls
 */

import { formatPace, formatDistance, formatDate } from '../formatters.js';

/**
 * Compress a single swim session to minimal representation
 * @param {Object} session - Full session object
 * @returns {Object} Compressed session
 */
export const compressSession = (session) => {
  return {
    id: session.id,
    date: session.date,
    dist: session.distance,          // meters
    dur: session.duration,            // minutes
    pace: session.pace?.toFixed(2),   // min/100m
    swolf: session.swolf || null,
    strokes: session.strokes || null,
    rating: session.rating,
  };
};

/**
 * Compress array of sessions with aggregated statistics
 * @param {Array} sessions - Array of session objects
 * @param {Object} options - Compression options
 * @returns {Object} Compressed data with stats
 */
export const compressSwimData = (sessions, options = {}) => {
  const {
    includeAllSessions = true,
    maxSessions = null,
    includeStats = true,
  } = options;

  // Sort by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // Limit sessions if specified
  const sessionsToInclude = maxSessions
    ? sortedSessions.slice(0, maxSessions)
    : sortedSessions;

  // Compress individual sessions
  const compressed = includeAllSessions
    ? sessionsToInclude.map(compressSession)
    : [];

  const result = { sessions: compressed };

  // Add aggregated statistics
  if (includeStats) {
    result.stats = calculateCompressedStats(sortedSessions);
  }

  return result;
};

/**
 * Calculate compressed statistics from sessions
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Compressed statistics
 */
export const calculateCompressedStats = (sessions) => {
  if (sessions.length === 0) {
    return { count: 0 };
  }

  const validPaceSessions = sessions.filter(s => s.pace > 0);
  const validSwolfSessions = sessions.filter(s => s.swolf > 0);

  const stats = {
    count: sessions.length,
    totalDist: sessions.reduce((sum, s) => sum + s.distance, 0),
    totalDur: sessions.reduce((sum, s) => sum + s.duration, 0),

    // Pace stats
    avgPace: validPaceSessions.length > 0
      ? (validPaceSessions.reduce((sum, s) => sum + s.pace, 0) / validPaceSessions.length).toFixed(2)
      : null,
    bestPace: validPaceSessions.length > 0
      ? Math.min(...validPaceSessions.map(s => s.pace)).toFixed(2)
      : null,

    // SWOLF stats
    avgSwolf: validSwolfSessions.length > 0
      ? Math.round(validSwolfSessions.reduce((sum, s) => sum + s.swolf, 0) / validSwolfSessions.length)
      : null,
    bestSwolf: validSwolfSessions.length > 0
      ? Math.min(...validSwolfSessions.map(s => s.swolf))
      : null,

    // Distance stats
    avgDist: Math.round(sessions.reduce((sum, s) => sum + s.distance, 0) / sessions.length),
    longestDist: Math.max(...sessions.map(s => s.distance)),

    // Date range
    firstSwim: sessions[sessions.length - 1]?.date,
    lastSwim: sessions[0]?.date,
  };

  return stats;
};

/**
 * Create a natural language summary of swim data
 * @param {Array} sessions - Array of session objects
 * @returns {string} Human-readable summary
 */
export const createSwimDataSummary = (sessions) => {
  if (sessions.length === 0) {
    return 'No swim data available.';
  }

  const stats = calculateCompressedStats(sessions);
  const sortedSessions = [...sessions].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  const parts = [
    `Total swims: ${stats.count}`,
    `Total distance: ${formatDistance(stats.totalDist)}km`,
    `Date range: ${formatDate(stats.firstSwim, 'short')} to ${formatDate(stats.lastSwim, 'short')}`,
  ];

  if (stats.avgPace) {
    parts.push(`Average pace: ${formatPace(parseFloat(stats.avgPace))}`);
    parts.push(`Best pace: ${formatPace(parseFloat(stats.bestPace))}`);
  }

  if (stats.avgSwolf) {
    parts.push(`Average SWOLF: ${stats.avgSwolf}`);
    parts.push(`Best SWOLF: ${stats.bestSwolf}`);
  }

  return parts.join(', ');
};

/**
 * Filter sessions by date range for targeted queries
 * @param {Array} sessions - Array of session objects
 * @param {number} days - Number of days to include
 * @returns {Array} Filtered sessions
 */
export const filterSessionsByDays = (sessions, days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

/**
 * Group sessions by time period for aggregated analysis
 * @param {Array} sessions - Array of session objects
 * @param {string} period - 'week', 'month', 'year'
 * @returns {Object} Grouped sessions with summaries
 */
export const groupSessionsByPeriod = (sessions, period = 'month') => {
  const groups = {};

  sessions.forEach(session => {
    const date = new Date(session.date);
    let key;

    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      case 'month':
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(session);
  });

  // Calculate stats for each group
  const result = {};
  Object.keys(groups).forEach(key => {
    const groupSessions = groups[key];
    result[key] = {
      sessions: groupSessions.length,
      stats: calculateCompressedStats(groupSessions),
    };
  });

  return result;
};

/**
 * Prepare context string for LLM with swim data
 * Uses compact JSON format to minimize token usage
 * @param {Array} sessions - Array of session objects
 * @param {Object} options - Compression options
 * @returns {string} Formatted context string
 */
export const prepareSwimContext = (sessions, options = {}) => {
  const {
    includeSummary = true,
    includeRecent = true,
    recentCount = 10,
    includeGrouped = false,
    groupPeriod = 'month',
  } = options;

  // Use compact JSON format instead of natural language to save tokens
  const context = {};

  if (includeSummary) {
    const stats = calculateCompressedStats(sessions);
    context.summary = {
      total: stats.count,
      dist_km: (stats.totalDist / 1000).toFixed(1),
      avg_pace: stats.avgPace,
      best_pace: stats.bestPace,
      avg_swolf: stats.avgSwolf,
      best_swolf: stats.bestSwolf,
      date_range: `${formatDate(stats.firstSwim, 'short')} to ${formatDate(stats.lastSwim, 'short')}`
    };
  }

  if (includeRecent && sessions.length > 0) {
    const recentSessions = [...sessions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, recentCount);

    context.recent = recentSessions.map(s => ({
      dt: formatDate(s.date, 'short'),
      m: s.distance,
      p: s.pace?.toFixed(2),
      sw: s.swolf || null,
      r: s.rating
    }));
  }

  if (includeGrouped) {
    const grouped = groupSessionsByPeriod(sessions, groupPeriod);
    context.grouped = {};

    Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6) // Reduce from 12 to 6 to save tokens
      .forEach(([key, data]) => {
        context.grouped[key] = {
          cnt: data.sessions,
          km: (data.stats.totalDist / 1000).toFixed(1),
          p: data.stats.avgPace
        };
      });
  }

  // Return compact JSON - much more token-efficient than natural language
  return JSON.stringify(context, null, 0);
};
