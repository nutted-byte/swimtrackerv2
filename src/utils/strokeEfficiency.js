/**
 * Stroke Efficiency Utilities
 * Calculate and analyze Distance Per Stroke (DPS) metrics
 */

/**
 * Calculate Distance Per Stroke (DPS) for a single session
 * @param {Object} session - Swim session with distance and strokes
 * @returns {number} Distance per stroke in meters
 */
export const calculateDPS = (session) => {
  if (!session || !session.strokes || session.strokes === 0 || !session.distance || session.distance === 0) {
    return 0;
  }
  return session.distance / session.strokes;
};

/**
 * Calculate Strokes Per Meter (inverse of DPS)
 * @param {Object} session - Swim session
 * @returns {number} Strokes per meter
 */
export const calculateSPM = (session) => {
  if (!session || !session.distance || session.distance === 0) {
    return 0;
  }
  return session.strokes / session.distance;
};

/**
 * Calculate average DPS across multiple sessions
 * @param {Array} sessions - Array of swim sessions
 * @returns {number} Average distance per stroke
 */
export const calculateAverageDPS = (sessions) => {
  const validSessions = sessions.filter(s => s.strokes > 0 && s.distance > 0);
  if (validSessions.length === 0) return 0;

  const totalDPS = validSessions.reduce((sum, s) => sum + calculateDPS(s), 0);
  return totalDPS / validSessions.length;
};

/**
 * Get efficiency grade based on DPS value
 * @param {number} dps - Distance per stroke value
 * @returns {Object} Grade information with label and color
 */
export const getDPSGrade = (dps) => {
  if (dps >= 2.5) {
    return {
      grade: 'Excellent',
      color: 'green',
      description: 'Outstanding stroke efficiency!'
    };
  }
  if (dps >= 2.0) {
    return {
      grade: 'Good',
      color: 'blue',
      description: 'Solid stroke efficiency'
    };
  }
  if (dps >= 1.5) {
    return {
      grade: 'Fair',
      color: 'yellow',
      description: 'Room for improvement'
    };
  }
  return {
    grade: 'Needs Work',
    color: 'orange',
    description: 'Focus on technique to improve efficiency'
  };
};

/**
 * Calculate DPS trend (improvement/decline) over time
 * @param {Array} recentSessions - Recent swim sessions
 * @param {Array} allSessions - All swim sessions for comparison
 * @returns {number} Percentage change in DPS
 */
export const calculateDPSTrend = (recentSessions, allSessions) => {
  const recentAvg = calculateAverageDPS(recentSessions);
  const overallAvg = calculateAverageDPS(allSessions);

  if (overallAvg === 0) return 0;
  return ((recentAvg - overallAvg) / overallAvg) * 100;
};

/**
 * Get the best DPS session from a list
 * @param {Array} sessions - Array of swim sessions
 * @returns {Object|null} Session with best DPS
 */
export const getBestDPSSession = (sessions) => {
  return sessions
    .filter(s => s.strokes > 0 && s.distance > 0)
    .reduce((best, s) => {
      const dps = calculateDPS(s);
      const bestDps = best ? calculateDPS(best) : 0;
      return dps > bestDps ? s : best;
    }, null);
};

/**
 * Calculate DPS statistics for a set of sessions
 * @param {Array} sessions - Array of swim sessions
 * @returns {Object} Statistics including avg, min, max, trend
 */
export const calculateDPSStats = (sessions) => {
  const validSessions = sessions.filter(s => s.strokes > 0 && s.distance > 0);

  if (validSessions.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      trend: 0,
      count: 0
    };
  }

  const dpsValues = validSessions.map(s => calculateDPS(s));
  const average = dpsValues.reduce((sum, dps) => sum + dps, 0) / dpsValues.length;
  const min = Math.min(...dpsValues);
  const max = Math.max(...dpsValues);

  // Calculate trend from first half vs second half
  const midpoint = Math.floor(validSessions.length / 2);
  const recentHalf = validSessions.slice(0, midpoint);
  const olderHalf = validSessions.slice(midpoint);
  const trend = calculateDPSTrend(recentHalf, olderHalf);

  return {
    average,
    min,
    max,
    trend,
    count: validSessions.length
  };
};

/**
 * Format DPS value for display
 * @param {number} dps - Distance per stroke value
 * @returns {string} Formatted string
 */
export const formatDPS = (dps) => {
  if (!dps || dps === 0) return 'N/A';
  return `${dps.toFixed(2)}m`;
};
