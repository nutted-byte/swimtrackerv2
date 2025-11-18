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

  // Calculate lengths (assuming 25m pool)
  const lengths = Math.round(lastSwim.distance / 25);

  // First sentence: Basic stats
  const mins = Math.floor(lastSwim.duration);
  const secs = Math.round((lastSwim.duration - mins) * 60);
  let summary = `You swam ${lengths} lengths in ${mins} minutes and ${secs} seconds`;

  if (lastSwim.calories && lastSwim.calories > 0) {
    summary += `, burning ${lastSwim.calories} calories`;
  }

  summary += '. ';

  // Add efficiency and DPS information
  // Calculate average SWOLF from last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentSwolfs = sessions.filter(s =>
    s.swolf > 0 && new Date(s.date) >= ninetyDaysAgo
  );

  const avgSwolf = recentSwolfs.length > 1
    ? recentSwolfs.reduce((sum, s) => sum + s.swolf, 0) / recentSwolfs.length
    : 0;

  if (lastSwim.swolf && lastSwim.swolf > 0) {
    // Get efficiency rating with more conversational labels
    const getEfficiencyDescription = (currentSwolf, averageSwolf) => {
      if (!averageSwolf || averageSwolf === 0) {
        if (currentSwolf < 40) return 'Your efficiency was excellent';
        if (currentSwolf < 50) return 'Your efficiency was good';
        return 'There\'s room to improve your efficiency';
      }
      const improvement = ((averageSwolf - currentSwolf) / averageSwolf) * 100;
      if (improvement > 5) return 'Your efficiency was excellent';
      if (improvement > -5) return 'Your efficiency was good';
      return 'There\'s room to improve your efficiency';
    };

    const efficiencyDesc = getEfficiencyDescription(lastSwim.swolf, avgSwolf);

    // Determine if SWOLF is low (good) or high (bad) relative to average
    let swolfDescriptor = '';
    if (avgSwolf > 0) {
      swolfDescriptor = lastSwim.swolf < avgSwolf ? 'low' : 'high';
    }

    summary += `${efficiencyDesc} with a ${swolfDescriptor ? swolfDescriptor + ' ' : ''}SWOLF score of ${lastSwim.swolf}`;
    if (avgSwolf > 0) {
      summary += ` compared to your 90-day average of ${avgSwolf.toFixed(0)}`;
    }
    summary += '. ';
  }

  // Add DPS information in plain English
  const currentDPS = calculateDPS(lastSwim);
  if (currentDPS > 0) {
    const { grade } = getDPSGrade(currentDPS);
    const gradeMap = {
      'Excellent': 'excellent',
      'Good': 'good',
      'Fair': 'fair',
      'Needs Work': 'could be improved'
    };
    const plainGrade = gradeMap[grade] || grade.toLowerCase();
    summary += `Your stroke length was ${plainGrade} at ${currentDPS.toFixed(2)} meters per stroke. `;
  }

  // Second sentence: Comparison to same distance swims
  const vsSameDistance = deepAnalysis?.comparative?.vsSameDistance;

  if (vsSameDistance) {
    const { bestPace, isBest } = vsSameDistance;
    const distanceKm = (lastSwim.distance / 1000).toFixed(lastSwim.distance >= 1000 ? 2 : 1);

    // Convert pace difference to seconds per 25m
    const currentSecondsPer25m = (lastSwim.pace * 60) / 4;
    const bestSecondsPer25m = (bestPace * 60) / 4;
    const secDiff = currentSecondsPer25m - bestSecondsPer25m;
    const absSecDiff = Math.abs(secDiff);

    if (isBest) {
      summary += `This is your fastest ${distanceKm}km swim ever!`;
    } else if (secDiff < 0) {
      // Faster than best
      summary += `You swam ${Math.round(absSecDiff)} seconds faster per length than your previous best at this distance.`;
    } else if (absSecDiff < 1.0) {
      // Very close to best
      summary += `You were just ${Math.round(absSecDiff)} seconds per length off your best ${distanceKm}km time.`;
    } else if (absSecDiff < 3.0) {
      // Decent performance
      summary += `You swam ${Math.round(absSecDiff)} seconds per length slower than your best ${distanceKm}km time.`;
    } else {
      // Room for improvement
      summary += `You've swum this distance faster before - keep at it!`;
    }
  }

  return summary;
};
