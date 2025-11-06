/**
 * Deep analysis orchestration - combines multiple analysis modules
 */

import { detectPacingStrategy, calculateFatigueIndex } from './lapAnalysis.js';
import { findPerformancePatterns } from '../patterns.js';
import { calculateStreaks } from '../streaks.js';
import { generateDetailedRecommendations } from '../recommendations.js';

/**
 * Calculate percentile ranking (local helper)
 * @param {number} value - Value to rank
 * @param {Array} allValues - All values to compare against
 * @returns {number} Percentile (0-100)
 */
const calculatePercentile = (value, allValues) => {
  if (!allValues || allValues.length === 0) return 50;

  const sorted = [...allValues].sort((a, b) => a - b); // For pace, lower is better
  const index = sorted.findIndex(v => v >= value);

  if (index === -1) return 100;
  return Math.round((index / sorted.length) * 100);
};

/**
 * Comprehensive analysis of the last swim
 * @param {Object} lastSwim - The most recent swim session
 * @param {Array} allSessions - All swim sessions for comparison
 * @returns {Object} Deep analysis with insights
 */
export const analyzeLastSwimDeep = (lastSwim, allSessions) => {
  if (!lastSwim) {
    return { error: 'No swim data provided' };
  }

  const analysis = {
    session: lastSwim,
    pacing: null,
    fatigue: null,
    comparative: null,
    patterns: null,
    streaks: null,
    recommendations: []
  };

  // Pacing analysis (if lap data available)
  if (lastSwim.laps && lastSwim.laps.length > 0) {
    analysis.pacing = detectPacingStrategy(lastSwim.laps);
    analysis.fatigue = calculateFatigueIndex(lastSwim.laps);
  }

  // Comparative analysis
  if (allSessions && allSessions.length > 1) {
    const recentSessions = allSessions.slice(0, 10); // Last 10 swims
    const avgPace = recentSessions
      .filter(s => s.pace > 0)
      .reduce((sum, s) => sum + s.pace, 0) / recentSessions.filter(s => s.pace > 0).length;

    // Find personal best
    const pb = allSessions
      .filter(s => s.pace > 0)
      .reduce((best, s) => !best || s.pace < best.pace ? s : best, null);

    // Find same-distance comparisons
    const sameDistance = allSessions
      .filter(s => Math.abs(s.distance - lastSwim.distance) < 100 && s.id !== lastSwim.id && s.pace > 0)
      .sort((a, b) => a.pace - b.pace);

    const bestSameDistance = sameDistance[0] || null;

    analysis.comparative = {
      vsRecent: {
        avgPace,
        paceDiff: ((lastSwim.pace - avgPace) / avgPace) * 100,
        isBetter: lastSwim.pace < avgPace
      },
      vsPB: pb ? {
        pbPace: pb.pace,
        paceDiff: ((lastSwim.pace - pb.pace) / pb.pace) * 100,
        isPB: lastSwim.id === pb.id
      } : null,
      vsSameDistance: bestSameDistance ? {
        bestPace: bestSameDistance.pace,
        paceDiff: ((lastSwim.pace - bestSameDistance.pace) / bestSameDistance.pace) * 100,
        isBest: lastSwim.pace <= bestSameDistance.pace,
        date: bestSameDistance.date
      } : null,
      percentile: calculatePercentile(lastSwim.pace, allSessions.filter(s => s.pace > 0).map(s => s.pace)),
      targetPace: pb ? (pb.pace + (lastSwim.pace - pb.pace) * 0.3).toFixed(2) : lastSwim.pace * 0.97
    };

    // Pattern analysis
    analysis.patterns = findPerformancePatterns(allSessions);

    // Streak analysis
    analysis.streaks = calculateStreaks(allSessions);

    // Calculate days since last swim
    if (allSessions.length > 1) {
      const previousSwim = allSessions[1];
      const daysSince = Math.floor(
        (new Date(lastSwim.date) - new Date(previousSwim.date)) / (1000 * 60 * 60 * 24)
      );
      analysis.daysSinceLastSwim = daysSince;
    }
  }

  // Generate recommendations (pass all sessions for context-aware recommendations)
  analysis.recommendations = generateDetailedRecommendations(analysis, allSessions);

  return analysis;
};
