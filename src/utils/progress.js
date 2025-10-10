/**
 * Progress analysis utilities for tracking swimmer improvement over time
 */

import { calculateTrend, calculatePaceTrend, calculateSwolfTrend } from './trends.js';

/**
 * Calculate average metrics for a set of sessions
 */
export const calculateAverages = (sessions) => {
  if (sessions.length === 0) {
    return { pace: 0, swolf: 0, distance: 0 };
  }

  const sum = sessions.reduce((acc, session) => ({
    pace: acc.pace + (session.pace || 0),
    swolf: acc.swolf + (session.swolf || 0),
    distance: acc.distance + (session.distance || 0)
  }), { pace: 0, swolf: 0, distance: 0 });

  return {
    pace: sum.pace / sessions.length,
    swolf: sum.swolf / sessions.length,
    distance: sum.distance / sessions.length
  };
};

/**
 * Analyze swim sessions to determine if user is improving
 * @param {Array} sessions - Array of swim sessions sorted by date (newest first)
 * @param {number} days - Number of days to analyze
 * @returns {Object} Analysis result with status and metrics
 */
export const analyzeProgress = (sessions, days = 30) => {
  if (sessions.length === 0) {
    return {
      status: 'no-data',
      message: 'No swim data available yet',
      improving: false,
      metrics: {}
    };
  }

  // Get sessions from last N days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const recentSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });

  if (recentSessions.length < 2) {
    return {
      status: 'insufficient-data',
      message: 'Upload more swims to see your progress',
      improving: false,
      metrics: {
        totalSwims: recentSessions.length,
        totalDistance: recentSessions.reduce((sum, s) => sum + s.distance, 0)
      }
    };
  }

  // Split into two periods: recent half vs older half
  const midpoint = Math.floor(recentSessions.length / 2);
  const recentHalf = recentSessions.slice(0, midpoint);
  const olderHalf = recentSessions.slice(midpoint);

  // Calculate averages for each period
  const recentAvg = calculateAverages(recentHalf);
  const olderAvg = calculateAverages(olderHalf);

  // Calculate trends
  const paceTrend = calculatePaceTrend(recentAvg.pace, olderAvg.pace);
  const swolfTrend = calculateSwolfTrend(recentAvg.swolf, olderAvg.swolf);
  const distanceTrend = calculateTrend(recentAvg.distance, olderAvg.distance);

  // Determine overall improvement
  // Pace and SWOLF improvements are more important than distance
  const paceWeight = 0.4;
  const swolfWeight = 0.4;
  const distanceWeight = 0.2;

  const weightedScore =
    (paceTrend * paceWeight) +
    (swolfTrend * swolfWeight) +
    (distanceTrend * distanceWeight);

  let status, message, improving;

  if (weightedScore > 3) {
    status = 'improving';
    message = `You're improving! ${Math.abs(Math.round(weightedScore))}% better over the last ${days} days`;
    improving = true;
  } else if (weightedScore < -3) {
    status = 'declining';
    message = `Let's refocus. Down ${Math.abs(Math.round(weightedScore))}% over the last ${days} days`;
    improving = false;
  } else {
    status = 'stable';
    message = `Staying consistent! Maintain this momentum`;
    improving = false;
  }

  return {
    status,
    message,
    improving,
    metrics: {
      totalSwims: recentSessions.length,
      totalDistance: recentSessions.reduce((sum, s) => sum + s.distance, 0),
      avgPace: recentAvg.pace,
      avgSwolf: recentAvg.swolf,
      avgDistance: recentAvg.distance,
      trends: {
        pace: paceTrend,
        swolf: swolfTrend,
        distance: distanceTrend
      },
      weightedScore: Math.round(weightedScore)
    }
  };
};

/**
 * Generate AI coaching insight based on analysis
 */
export const generateCoachingInsight = (analysis) => {
  const { status, metrics } = analysis;

  if (status === 'no-data' || status === 'insufficient-data') {
    return "Upload your swim data to get personalized coaching insights!";
  }

  const trends = metrics.trends;
  const insights = [];

  // Pace insights
  if (trends.pace > 5) {
    insights.push(`Your pace has improved by ${trends.pace}%! Keep up the consistent effort.`);
  } else if (trends.pace < -5) {
    insights.push(`Your pace has slowed. Consider shorter, more intense intervals to build speed.`);
  }

  // SWOLF insights
  if (trends.swolf > 5) {
    insights.push(`Great efficiency gains! Your SWOLF improved by ${trends.swolf}%.`);
  } else if (trends.swolf < -5) {
    insights.push(`Focus on stroke technique - try counting your strokes per length.`);
  }

  // Distance insights
  if (trends.distance > 10) {
    insights.push(`You're swimming longer distances - excellent endurance building!`);
  }

  // Default insight if no specific trends
  if (insights.length === 0) {
    insights.push(`You're maintaining consistency with ${metrics.totalSwims} swims. Try mixing up your routine with intervals or technique work.`);
  }

  return insights.join(' ');
};
