/**
 * Momentum tracking utilities
 * Analyzes training trends to show if user is building momentum
 */

/**
 * Calculate training momentum (trending up/steady/down)
 * @param {Array} sessions - All swim sessions sorted by date (newest first)
 * @returns {Object} Momentum data with trend, percentage, and message
 */
export const calculateMomentum = (sessions) => {
  if (sessions.length < 4) {
    return {
      trend: 'insufficient-data',
      percentage: 0,
      message: 'Keep swimming to build momentum!',
      breakdown: null
    };
  }

  const now = new Date();

  // Get last 2 weeks (recent period)
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recentSessions = sessions.filter(s =>
    new Date(s.date) >= twoWeeksAgo
  );

  // Get 4 weeks before that (comparison period)
  const sixWeeksAgo = new Date(now);
  sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks total

  const comparisonSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= sixWeeksAgo && sessionDate < twoWeeksAgo;
  });

  if (recentSessions.length === 0 || comparisonSessions.length === 0) {
    return {
      trend: 'insufficient-data',
      percentage: 0,
      message: 'Keep swimming to build momentum!',
      breakdown: null
    };
  }

  // Calculate metrics for both periods
  const recentMetrics = calculatePeriodMetrics(recentSessions);
  const comparisonMetrics = calculatePeriodMetrics(comparisonSessions);

  // Get detailed breakdown
  const breakdown = getMomentumBreakdown(sessions);

  // Calculate weighted momentum score
  // Frequency (40%), Volume (30%), Pace (30%)
  const frequencyChange = ((recentMetrics.frequency - comparisonMetrics.frequency) / comparisonMetrics.frequency) * 100;
  const volumeChange = ((recentMetrics.avgDistance - comparisonMetrics.avgDistance) / comparisonMetrics.avgDistance) * 100;

  // For pace, lower is better, so invert the calculation
  const paceChange = comparisonMetrics.avgPace > 0
    ? ((comparisonMetrics.avgPace - recentMetrics.avgPace) / comparisonMetrics.avgPace) * 100
    : 0;

  const momentumScore = (frequencyChange * 0.4) + (volumeChange * 0.3) + (paceChange * 0.3);

  // Determine trend
  let trend, message;
  if (momentumScore > 10) {
    trend = 'up';
    message = `Building momentum! Up ${Math.round(momentumScore)}% from last month`;
  } else if (momentumScore < -10) {
    trend = 'down';
    message = `Training dipped ${Math.abs(Math.round(momentumScore))}% - let's get back on track`;
  } else {
    trend = 'steady';
    message = 'Maintaining steady training - keep it consistent!';
  }

  return {
    trend,
    percentage: Math.round(momentumScore),
    message,
    breakdown
  };
};

/**
 * Calculate metrics for a period of sessions
 * @param {Array} sessions - Sessions in the period
 * @returns {Object} Period metrics
 */
const calculatePeriodMetrics = (sessions) => {
  if (sessions.length === 0) {
    return {
      frequency: 0,
      avgDistance: 0,
      avgPace: 0
    };
  }

  // Calculate frequency (sessions per week)
  const sessionDates = sessions.map(s => new Date(s.date));
  const oldestDate = new Date(Math.min(...sessionDates));
  const newestDate = new Date(Math.max(...sessionDates));
  const daysDiff = Math.max(1, (newestDate - oldestDate) / (1000 * 60 * 60 * 24));
  const weeksDiff = daysDiff / 7;
  const frequency = sessions.length / weeksDiff;

  // Calculate average distance
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const avgDistance = totalDistance / sessions.length;

  // Calculate average pace
  const validPaceSessions = sessions.filter(s => s.pace > 0);
  const avgPace = validPaceSessions.length > 0
    ? validPaceSessions.reduce((sum, s) => sum + s.pace, 0) / validPaceSessions.length
    : 0;

  return {
    frequency,
    avgDistance,
    avgPace
  };
};

/**
 * Get detailed momentum breakdown by metric
 * @param {Array} sessions - All swim sessions sorted by date (newest first)
 * @returns {Object} Breakdown of frequency, volume, and pace trends
 */
export const getMomentumBreakdown = (sessions) => {
  if (sessions.length < 4) {
    return null;
  }

  const now = new Date();

  // Get last 2 weeks
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recentSessions = sessions.filter(s =>
    new Date(s.date) >= twoWeeksAgo
  );

  // Get 4 weeks before that
  const sixWeeksAgo = new Date(now);
  sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

  const comparisonSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= sixWeeksAgo && sessionDate < twoWeeksAgo;
  });

  if (recentSessions.length === 0 || comparisonSessions.length === 0) {
    return null;
  }

  const recentMetrics = calculatePeriodMetrics(recentSessions);
  const comparisonMetrics = calculatePeriodMetrics(comparisonSessions);

  // Calculate percentage changes
  const frequencyChange = comparisonMetrics.frequency > 0
    ? ((recentMetrics.frequency - comparisonMetrics.frequency) / comparisonMetrics.frequency) * 100
    : 0;

  const volumeChange = comparisonMetrics.avgDistance > 0
    ? ((recentMetrics.avgDistance - comparisonMetrics.avgDistance) / comparisonMetrics.avgDistance) * 100
    : 0;

  const paceChange = comparisonMetrics.avgPace > 0
    ? ((comparisonMetrics.avgPace - recentMetrics.avgPace) / comparisonMetrics.avgPace) * 100
    : 0;

  return {
    frequency: {
      recent: recentMetrics.frequency.toFixed(1),
      comparison: comparisonMetrics.frequency.toFixed(1),
      change: Math.round(frequencyChange),
      trend: frequencyChange > 5 ? 'up' : frequencyChange < -5 ? 'down' : 'steady'
    },
    volume: {
      recent: Math.round(recentMetrics.avgDistance),
      comparison: Math.round(comparisonMetrics.avgDistance),
      change: Math.round(volumeChange),
      trend: volumeChange > 5 ? 'up' : volumeChange < -5 ? 'down' : 'steady'
    },
    pace: {
      recent: recentMetrics.avgPace.toFixed(2),
      comparison: comparisonMetrics.avgPace.toFixed(2),
      change: Math.round(paceChange),
      trend: paceChange > 3 ? 'up' : paceChange < -3 ? 'down' : 'steady'
    }
  };
};

/**
 * Get a motivational message based on momentum
 * @param {Object} momentum - Momentum data from calculateMomentum
 * @returns {string} Motivational message
 */
export const getMomentumMotivation = (momentum) => {
  if (!momentum || momentum.trend === 'insufficient-data') {
    return 'Keep swimming to build momentum!';
  }

  const { trend, percentage } = momentum;

  if (trend === 'up') {
    if (percentage > 30) {
      return '🔥 On fire! Amazing progress!';
    } else if (percentage > 20) {
      return '📈 Crushing it! Keep going!';
    } else {
      return '✨ Building momentum nicely!';
    }
  } else if (trend === 'down') {
    if (percentage < -30) {
      return '💪 Time to get back in the pool!';
    } else {
      return '🎯 Small dip - easy to recover!';
    }
  } else {
    return '⚡ Consistent training pays off!';
  }
};
