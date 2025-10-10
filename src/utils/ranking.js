/**
 * Swim ranking and percentile calculation utilities
 */

/**
 * Calculate percentile ranking
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
 * Calculate comprehensive ranking for a swim session
 * @param {Object} lastSwim - The swim session to rank
 * @param {Array} allSessions - All swim sessions
 * @returns {Object} Ranking data including percentiles and records
 */
export const calculateSwimRanking = (lastSwim, allSessions) => {
  if (!lastSwim || !allSessions || allSessions.length === 0) {
    return null;
  }

  // Filter valid sessions for each metric
  const paceSwims = allSessions.filter(s => s.pace > 0);
  const distanceSwims = allSessions.filter(s => s.distance > 0);
  const swolfSwims = allSessions.filter(s => s.swolf > 0);

  // Calculate rankings (lower rank number = better)
  const paceRank = paceSwims
    .sort((a, b) => a.pace - b.pace) // Lower pace is better
    .findIndex(s => s.id === lastSwim.id) + 1;

  const distanceRank = distanceSwims
    .sort((a, b) => b.distance - a.distance) // Higher distance is better
    .findIndex(s => s.id === lastSwim.id) + 1;

  const swolfRank = swolfSwims
    .sort((a, b) => a.swolf - b.swolf) // Lower swolf is better
    .findIndex(s => s.id === lastSwim.id) + 1;

  // Calculate percentiles
  const pacePercentile = lastSwim.pace > 0 ? calculatePercentile(lastSwim.pace, paceSwims.map(s => s.pace)) : null;
  const distancePercentile = calculatePercentile(lastSwim.distance, distanceSwims.map(s => s.distance));
  const swolfPercentile = lastSwim.swolf > 0 ? calculatePercentile(lastSwim.swolf, swolfSwims.map(s => s.swolf)) : null;

  // Calculate best overall percentile (inverted for pace/swolf since lower is better)
  const percentiles = [
    pacePercentile !== null ? 100 - pacePercentile : null,
    distancePercentile,
    swolfPercentile !== null ? 100 - swolfPercentile : null
  ].filter(p => p !== null);

  const overallPercentile = percentiles.length > 0
    ? Math.round(percentiles.reduce((sum, p) => sum + p, 0) / percentiles.length)
    : 0;

  // Filter sessions from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSessions = allSessions.filter(s => new Date(s.date) >= thirtyDaysAgo);

  // Calculate rank in past 30 days (by pace)
  const monthRank = recentSessions
    .filter(s => s.pace > 0)
    .sort((a, b) => a.pace - b.pace)
    .findIndex(s => s.id === lastSwim.id) + 1;

  // Check if any records (top 3)
  const isRecord = {
    pace: paceRank > 0 && paceRank <= 3,
    distance: distanceRank > 0 && distanceRank <= 3,
    swolf: swolfRank > 0 && swolfRank <= 3
  };

  return {
    overallPercentile,
    paceRank,
    distanceRank,
    swolfRank,
    monthRank,
    monthTotal: recentSessions.length,
    isRecord,
    totalSwims: allSessions.length,
    pacePercentile: pacePercentile !== null ? 100 - pacePercentile : null, // Invert so higher is better
    distancePercentile,
    swolfPercentile: swolfPercentile !== null ? 100 - swolfPercentile : null // Invert so higher is better
  };
};
