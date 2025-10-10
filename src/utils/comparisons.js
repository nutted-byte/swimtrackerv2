/**
 * Comparison utilities for analyzing performance across time periods
 */

import { calculateTrend, calculatePaceTrend, calculateSwolfTrend } from './trends.js';
import { calculateAverages } from './progress.js';

/**
 * Get data for compare mode (current window vs previous window)
 * @param {Array} allSessions - All available sessions
 * @param {number} days - Window size in days
 * @returns {Object} { current, previous, deltas }
 */
export const getCompareData = (allSessions, days = 30) => {
  if (!allSessions || allSessions.length === 0) {
    return { current: [], previous: [], deltas: null };
  }

  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - days);

  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - days);

  // Filter sessions for each window
  const currentSessions = allSessions.filter(s => {
    const d = new Date(s.date);
    return d >= currentStart && d <= now;
  });

  const previousSessions = allSessions.filter(s => {
    const d = new Date(s.date);
    return d >= previousStart && d < currentStart;
  });

  // Calculate deltas
  const currentStats = calculateAverages(currentSessions);
  const previousStats = calculateAverages(previousSessions);

  const deltas = {
    pace: calculatePaceTrend(currentStats.pace, previousStats.pace),
    distance: calculateTrend(currentStats.distance, previousStats.distance),
    swolf: calculateSwolfTrend(currentStats.swolf, previousStats.swolf),
    count: currentSessions.length - previousSessions.length,
    countPercent: previousSessions.length > 0
      ? Math.round(((currentSessions.length - previousSessions.length) / previousSessions.length) * 100)
      : 0
  };

  return {
    current: currentSessions,
    previous: previousSessions,
    deltas,
    currentStats,
    previousStats
  };
};
