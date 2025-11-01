/**
 * Swim ranking and simple comparison utilities
 */

/**
 * Calculate simple comparison for a metric
 * @param {number} currentValue - Current swim value
 * @param {number} avgValue - Average of recent swims
 * @param {boolean} lowerIsBetter - True for pace/SWOLF, false for distance
 * @returns {Object} Comparison status and difference
 */
const calculateSimpleComparison = (currentValue, avgValue, lowerIsBetter = false) => {
  if (!currentValue || !avgValue || avgValue === 0) {
    return { status: 'same', difference: 0, percentDifference: 0 };
  }

  const difference = currentValue - avgValue;
  const percentDifference = Math.abs((difference / avgValue) * 100);

  // Determine status based on threshold (5% is significant)
  if (percentDifference < 5) {
    return { status: 'same', difference, percentDifference: percentDifference.toFixed(0) };
  }

  const isImprovement = lowerIsBetter ? difference < 0 : difference > 0;

  return {
    status: isImprovement ? 'better' : 'worse',
    difference,
    percentDifference: percentDifference.toFixed(0)
  };
};

/**
 * Calculate simple, user-friendly swim comparison
 * @param {Object} lastSwim - The swim session to rank
 * @param {Array} allSessions - All swim sessions
 * @returns {Object} Simple comparison data with encouraging messages
 */
export const calculateSwimRanking = (lastSwim, allSessions) => {
  if (!lastSwim || !allSessions || allSessions.length < 2) {
    return null;
  }

  // Get recent swims (last 10 or last 30 days, whichever is more)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSessions = allSessions
    .filter(s => s.id !== lastSwim.id) // Exclude current swim
    .filter(s => new Date(s.date) >= thirtyDaysAgo)
    .slice(0, 10);

  // If not enough recent swims, use last 10
  const comparisonSessions = recentSessions.length >= 3 ? recentSessions : allSessions.slice(1, 11);

  // Calculate averages for comparison
  const paceSwims = comparisonSessions.filter(s => s.pace > 0);
  const distanceSwims = comparisonSessions.filter(s => s.distance > 0);
  const swolfSwims = comparisonSessions.filter(s => s.swolf > 0);

  const avgPace = paceSwims.length > 0 ? paceSwims.reduce((sum, s) => sum + s.pace, 0) / paceSwims.length : null;
  const avgDistance = distanceSwims.length > 0 ? distanceSwims.reduce((sum, s) => sum + s.distance, 0) / distanceSwims.length : null;
  const avgSwolf = swolfSwims.length > 0 ? swolfSwims.reduce((sum, s) => sum + s.swolf, 0) / swolfSwims.length : null;

  // Check if personal records (best ever)
  const allPaceSwims = allSessions.filter(s => s.pace > 0);
  const allDistanceSwims = allSessions.filter(s => s.distance > 0);
  const allSwolfSwims = allSessions.filter(s => s.swolf > 0);

  const isPaceRecord = lastSwim.pace > 0 && lastSwim.pace === Math.min(...allPaceSwims.map(s => s.pace));
  const isDistanceRecord = lastSwim.distance === Math.max(...allDistanceSwims.map(s => s.distance));
  const isSwolfRecord = lastSwim.swolf > 0 && lastSwim.swolf === Math.min(...allSwolfSwims.map(s => s.swolf));

  // Calculate simple comparisons
  const paceComparison = lastSwim.pace > 0 && avgPace
    ? calculateSimpleComparison(lastSwim.pace, avgPace, true)
    : null;

  const distanceComparison = avgDistance
    ? calculateSimpleComparison(lastSwim.distance, avgDistance, false)
    : null;

  const swolfComparison = lastSwim.swolf > 0 && avgSwolf
    ? calculateSimpleComparison(lastSwim.swolf, avgSwolf, true)
    : null;

  // Calculate month rank (only show if top 3)
  const monthSessions = allSessions.filter(s => new Date(s.date) >= thirtyDaysAgo);
  const monthRank = monthSessions
    .filter(s => s.pace > 0)
    .sort((a, b) => a.pace - b.pace)
    .findIndex(s => s.id === lastSwim.id) + 1;

  return {
    pace: paceComparison ? {
      ...paceComparison,
      isRecord: isPaceRecord,
      avgValue: avgPace
    } : null,
    distance: distanceComparison ? {
      ...distanceComparison,
      isRecord: isDistanceRecord,
      avgValue: avgDistance
    } : null,
    swolf: swolfComparison ? {
      ...swolfComparison,
      isRecord: isSwolfRecord,
      avgValue: avgSwolf
    } : null,
    monthRank: monthRank > 0 && monthRank <= 3 ? monthRank : null,
    monthTotal: monthSessions.length,
    totalSwims: allSessions.length
  };
};
