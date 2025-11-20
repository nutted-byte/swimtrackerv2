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

  let summary = `You swam ${lengths} lengths (${distanceKm}km) in ${mins} minutes and ${secs} seconds`;

  if (lastSwim.calories && lastSwim.calories > 0) {
    summary += `, burning ${lastSwim.calories} calories`;
  }
  summary += '. ';

  // === 2. HOW IT COMPARES ===
  const vsSameDistance = deepAnalysis?.comparative?.vsSameDistance;

  if (vsSameDistance) {
    const { bestPace, isBest } = vsSameDistance;
    const currentSecondsPer25m = (lastSwim.pace * 60) / 4;
    const bestSecondsPer25m = (bestPace * 60) / 4;
    const secDiff = currentSecondsPer25m - bestSecondsPer25m;
    const absSecDiff = Math.abs(secDiff);

    if (isBest) {
      summary += `This is your fastest ${distanceKm}km swim ever! `;
    } else if (absSecDiff < 1.0) {
      summary += `You were just ${Math.round(absSecDiff)} second per length off your best time. `;
    } else if (absSecDiff < 3.0) {
      summary += `You were ${Math.round(absSecDiff)} seconds per length slower than your best time. `;
    } else {
      summary += `You were ${Math.round(absSecDiff)} seconds per length slower than your best time. `;
    }
  }

  // Calculate average SWOLF for recommendations
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const recentSwolfs = sessions.filter(s =>
    s.swolf > 0 && new Date(s.date) >= ninetyDaysAgo
  );
  const avgSwolf = recentSwolfs.length > 1
    ? recentSwolfs.reduce((sum, s) => sum + s.swolf, 0) / recentSwolfs.length
    : 0;

  // === 3. WHAT TO DO NEXT TIME ===

  // Simple logic: faster or longer, or focus on something if slower
  if (vsSameDistance) {
    const { isBest, bestPace } = vsSameDistance;

    if (isBest) {
      // If this was their best, suggest going longer
      const nextDistance = Math.round((lastSwim.distance + 100) / 100) * 100; // Round to nearest 100m
      summary += `For your next swim, try increasing to ${nextDistance}m to build endurance.`;
    } else {
      // If slower, suggest what to focus on
      const currentSecondsPer25m = (lastSwim.pace * 60) / 4;
      const bestSecondsPer25m = (bestPace * 60) / 4;
      const secDiff = currentSecondsPer25m - bestSecondsPer25m;

      if (secDiff > 3) {
        // Significantly slower - suggest focusing on something specific
        if (lastSwim.swolf && avgSwolf > 0 && lastSwim.swolf > avgSwolf) {
          summary += `For your next swim, focus on efficiency - aim for a lower SWOLF score by taking fewer strokes per length.`;
        } else {
          summary += `For your next swim, focus on pace - try to match your best time of ${Math.floor(bestPace)}:${Math.round((bestPace - Math.floor(bestPace)) * 60).toString().padStart(2, '0')} per 100m.`;
        }
      } else {
        // Close to best - suggest pushing for PB
        summary += `For your next swim, try beating your best pace - you're close!`;
      }
    }
  } else {
    // No comparison available - suggest increasing distance
    const nextDistance = Math.round((lastSwim.distance + 100) / 100) * 100;
    summary += `For your next swim, try increasing to ${nextDistance}m.`;
  }

  return summary;
};
