/**
 * Statistical analysis utilities for swim performance
 */

/**
 * Calculate rolling average for a metric
 * @param {Array} data - Array of data points with metric values
 * @param {string} metric - The metric key to calculate rolling average for
 * @param {number} window - Window size (e.g., 3 for 3-session, 7 for 7-day)
 * @returns {Array} Data with rolling average added
 */
export const calculateRollingAverage = (data, metric, window = 3) => {
  if (!data || data.length === 0) return [];

  return data.map((point, index) => {
    const start = Math.max(0, index - window + 1);
    const windowData = data.slice(start, index + 1);
    const sum = windowData.reduce((acc, d) => acc + (d[metric] || 0), 0);
    const avg = sum / windowData.length;

    return {
      ...point,
      [`${metric}RollingAvg`]: avg
    };
  });
};

/**
 * Calculate rolling average by date (e.g., 7-day rolling)
 * @param {Array} sessions - Array of sessions with date field
 * @param {string} metric - The metric to calculate
 * @param {number} days - Number of days in rolling window
 * @returns {Array} Sessions with rolling average
 */
export const calculateDateRollingAverage = (sessions, metric, days = 7) => {
  if (!sessions || sessions.length === 0) return [];

  // Sort by date ascending
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

  return sorted.map((session, index) => {
    const sessionDate = new Date(session.date);
    const windowStart = new Date(sessionDate);
    windowStart.setDate(windowStart.getDate() - days);

    // Get all sessions in the window
    const windowSessions = sorted.filter((s, i) => {
      const sDate = new Date(s.date);
      return sDate > windowStart && sDate <= sessionDate && i <= index;
    });

    if (windowSessions.length === 0) {
      return { ...session, [`${metric}Rolling${days}d`]: session[metric] };
    }

    const sum = windowSessions.reduce((acc, s) => acc + (s[metric] || 0), 0);
    const avg = sum / windowSessions.length;

    return {
      ...session,
      [`${metric}Rolling${days}d`]: avg
    };
  });
};

/**
 * Calculate linear regression for trend line
 * @param {Array} data - Array of data points with x and y values
 * @param {string} xKey - Key for x values (e.g., 'index')
 * @param {string} yKey - Key for y values (e.g., 'pace')
 * @returns {Object} { slope, intercept, r2, trend: 'improving'|'stable'|'declining', percentChange }
 */
export const calculateLinearRegression = (data, xKey = 'index', yKey = 'pace') => {
  if (!data || data.length < 2) {
    return { slope: 0, intercept: 0, r2: 0, trend: 'stable', percentChange: 0 };
  }

  // Add index if using it
  const points = data.map((d, i) => ({
    x: xKey === 'index' ? i : d[xKey],
    y: d[yKey] || 0
  })).filter(p => p.y > 0); // Filter out invalid data

  if (points.length < 2) {
    return { slope: 0, intercept: 0, r2: 0, trend: 'stable', percentChange: 0 };
  }

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  const ssRes = points.reduce((sum, p) => {
    const predicted = slope * p.x + intercept;
    return sum + Math.pow(p.y - predicted, sum);
  }, 0);
  const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
  const r2 = 1 - (ssRes / ssTot);

  // Calculate percent change from start to end of trend line
  const startValue = slope * points[0].x + intercept;
  const endValue = slope * points[n - 1].x + intercept;
  const percentChange = startValue !== 0 ? ((endValue - startValue) / startValue) * 100 : 0;

  // Determine trend (for pace/swolf, negative slope is improvement)
  let trend = 'stable';
  if (yKey === 'pace' || yKey === 'swolf') {
    if (percentChange < -3) trend = 'improving';
    else if (percentChange > 3) trend = 'declining';
  } else {
    if (percentChange > 3) trend = 'improving';
    else if (percentChange < -3) trend = 'declining';
  }

  return { slope, intercept, r2, trend, percentChange: Math.round(percentChange) };
};

/**
 * Calculate consistency score (0-100)
 * Based on swim frequency and pace variability
 * @param {Array} sessions - Array of sessions in time window
 * @param {number} days - Time window in days
 * @returns {number} Score from 0-100
 */
export const calculateConsistencyScore = (sessions, days = 30) => {
  if (!sessions || sessions.length === 0) return 0;

  // Component 1: Frequency score (0-50 points)
  // Target: 3+ swims per week
  const weeks = days / 7;
  const targetSwims = weeks * 3;
  const actualSwims = sessions.length;
  const frequencyScore = Math.min(50, (actualSwims / targetSwims) * 50);

  // Component 2: Pace variability score (0-50 points)
  // Lower variability = higher score
  const paces = sessions.map(s => s.pace).filter(p => p > 0);
  if (paces.length < 2) {
    return Math.round(frequencyScore);
  }

  const meanPace = paces.reduce((sum, p) => sum + p, 0) / paces.length;
  const variance = paces.reduce((sum, p) => sum + Math.pow(p - meanPace, 2), 0) / paces.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / meanPace) * 100; // CV as percentage

  // Score: CV < 5% = 50pts, CV > 20% = 0pts, linear in between
  const variabilityScore = Math.max(0, Math.min(50, 50 - (coefficientOfVariation - 5) * (50 / 15)));

  return Math.round(frequencyScore + variabilityScore);
};
