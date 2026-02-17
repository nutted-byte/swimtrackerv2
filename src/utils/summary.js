/**
 * Summary utilities for swim sessions
 * Generates natural language summaries and groups sessions by time periods
 */

import { formatDuration } from './formatters';
import { calculateDPS, getDPSGrade } from './strokeEfficiency';

/**
 * Group sessions by month/year
 * @param {Array} sessions - Sessions to group
 * @returns {Array} Array of month groups with sessions and stats
 */
export const groupSessionsByMonth = (sessions) => {
  if (!sessions || sessions.length === 0) return [];

  const monthMap = new Map();

  sessions.forEach(session => {
    const date = new Date(session.date);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        year,
        month,
        monthKey,
        monthName: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        sessions: [],
        stats: {
          totalDistance: 0,
          totalDuration: 0,
          totalSwims: 0,
          avgPace: 0,
          avgSwolf: 0,
          bestPace: null,
          longestSwim: null
        }
      });
    }

    const group = monthMap.get(monthKey);
    group.sessions.push(session);
  });

  // Calculate stats for each month
  return Array.from(monthMap.values())
    .map(group => {
      const { sessions } = group;

      // Calculate totals
      group.stats.totalSwims = sessions.length;
      group.stats.totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
      group.stats.totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

      // Calculate averages
      const validPaces = sessions.filter(s => s.pace > 0);
      const validSwolfs = sessions.filter(s => s.swolf > 0);

      group.stats.avgPace = validPaces.length > 0
        ? validPaces.reduce((sum, s) => sum + s.pace, 0) / validPaces.length
        : 0;

      group.stats.avgSwolf = validSwolfs.length > 0
        ? validSwolfs.reduce((sum, s) => sum + s.swolf, 0) / validSwolfs.length
        : 0;

      // Find best performances
      group.stats.bestPace = validPaces.length > 0
        ? validPaces.reduce((best, s) => !best || s.pace < best.pace ? s : best, null)
        : null;

      group.stats.longestSwim = sessions.reduce((best, s) =>
        !best || s.distance > best.distance ? s : best, null);

      return group;
    })
    .sort((a, b) => {
      // Sort by year and month descending (newest first)
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
};

/**
 * Generate a natural language summary of the last swim
 * @param {Object} lastSwim - The most recent swim session
 * @param {Object} deepAnalysis - Deep analysis data from analyzeLastSwimDeep
 * @param {Object} ranking - Ranking data from calculateSwimRanking
 * @param {Array} sessions - All sessions
 * @returns {string} Natural language summary
 */
export const generateSwimSummary = (lastSwim, deepAnalysis, ranking, sessions) => {
  if (!lastSwim) return null;

  // === 1. WHAT YOU DID ===
  const lengths = Math.round(lastSwim.distance / 25);
  const mins = Math.floor(lastSwim.duration);
  const secs = Math.round((lastSwim.duration - mins) * 60);
  const distanceKm = (lastSwim.distance / 1000).toFixed(lastSwim.distance >= 1000 ? 2 : 1);

  let summary = `You swam ${lengths} lengths (${distanceKm}km) in ${mins} mins`;

  if (lastSwim.calories && lastSwim.calories > 0) {
    summary += ` and burnt ${lastSwim.calories} calories`;
  }
  summary += '.';

  return summary;
};
