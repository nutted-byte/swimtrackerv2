/**
 * Weekly statistics utilities
 * Calculate and compare weekly swimming metrics
 */

/**
 * Get the start and end dates of the current week (Monday-Sunday)
 * @returns {Object} Start and end dates
 */
const getCurrentWeekBounds = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Adjust to make Monday the start of the week
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};

/**
 * Get the start and end dates of last week (Monday-Sunday)
 * @returns {Object} Start and end dates
 */
const getLastWeekBounds = () => {
  const { start: thisWeekStart } = getCurrentWeekBounds();

  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);

  const lastWeekStart = new Date(lastWeekEnd);
  lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
  lastWeekStart.setHours(0, 0, 0, 0);

  return { start: lastWeekStart, end: lastWeekEnd };
};

/**
 * Calculate stats for sessions in a time period
 * @param {Array} sessions - Sessions to analyze
 * @returns {Object} Period statistics
 */
const calculatePeriodStats = (sessions) => {
  if (sessions.length === 0) {
    return {
      count: 0,
      totalDistance: 0,
      avgDistance: 0,
      avgPace: 0,
      avgSwolf: 0,
      totalDuration: 0,
      avgDuration: 0,
      daysActive: 0
    };
  }

  const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  const validPaceSessions = sessions.filter(s => s.pace > 0);
  const avgPace = validPaceSessions.length > 0
    ? validPaceSessions.reduce((sum, s) => sum + s.pace, 0) / validPaceSessions.length
    : 0;

  const validSwolfSessions = sessions.filter(s => s.swolf > 0);
  const avgSwolf = validSwolfSessions.length > 0
    ? validSwolfSessions.reduce((sum, s) => sum + s.swolf, 0) / validSwolfSessions.length
    : 0;

  // Count unique days with activity
  const uniqueDays = new Set(
    sessions.map(s => new Date(s.date).toDateString())
  ).size;

  return {
    count: sessions.length,
    totalDistance,
    avgDistance: totalDistance / sessions.length,
    avgPace,
    avgSwolf,
    totalDuration,
    avgDuration: totalDuration / sessions.length,
    daysActive: uniqueDays
  };
};

/**
 * Get current week statistics
 * @param {Array} sessions - All swim sessions sorted by date (newest first)
 * @returns {Object} Current week stats
 */
export const getCurrentWeekStats = (sessions) => {
  const { start, end } = getCurrentWeekBounds();

  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= start && sessionDate <= end;
  });

  return {
    ...calculatePeriodStats(weekSessions),
    weekStart: start,
    weekEnd: end,
    sessions: weekSessions
  };
};

/**
 * Get last week statistics
 * @param {Array} sessions - All swim sessions sorted by date (newest first)
 * @returns {Object} Last week stats
 */
export const getLastWeekStats = (sessions) => {
  const { start, end } = getLastWeekBounds();

  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= start && sessionDate <= end;
  });

  return {
    ...calculatePeriodStats(weekSessions),
    weekStart: start,
    weekEnd: end,
    sessions: weekSessions
  };
};

/**
 * Calculate weekly trend (comparison between current and last week)
 * @param {Object} currentWeek - Current week stats
 * @param {Object} lastWeek - Last week stats
 * @returns {Object} Trend data with percentage changes
 */
export const getWeeklyTrend = (currentWeek, lastWeek) => {
  if (!currentWeek || !lastWeek) {
    return {
      count: { change: 0, trend: 'steady' },
      distance: { change: 0, trend: 'steady' },
      pace: { change: 0, trend: 'steady' },
      daysActive: { change: 0, trend: 'steady' }
    };
  }

  // Calculate percentage changes
  const countChange = lastWeek.count > 0
    ? ((currentWeek.count - lastWeek.count) / lastWeek.count) * 100
    : (currentWeek.count > 0 ? 100 : 0);

  const distanceChange = lastWeek.totalDistance > 0
    ? ((currentWeek.totalDistance - lastWeek.totalDistance) / lastWeek.totalDistance) * 100
    : (currentWeek.totalDistance > 0 ? 100 : 0);

  // For pace, lower is better, so invert the trend
  const paceChange = lastWeek.avgPace > 0 && currentWeek.avgPace > 0
    ? ((lastWeek.avgPace - currentWeek.avgPace) / lastWeek.avgPace) * 100
    : 0;

  const daysActiveChange = lastWeek.daysActive > 0
    ? ((currentWeek.daysActive - lastWeek.daysActive) / lastWeek.daysActive) * 100
    : (currentWeek.daysActive > 0 ? 100 : 0);

  // Determine trends
  const getTrend = (change) => {
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'steady';
  };

  return {
    count: {
      change: Math.round(countChange),
      trend: getTrend(countChange),
      current: currentWeek.count,
      previous: lastWeek.count
    },
    distance: {
      change: Math.round(distanceChange),
      trend: getTrend(distanceChange),
      current: currentWeek.totalDistance,
      previous: lastWeek.totalDistance
    },
    pace: {
      change: Math.round(paceChange),
      trend: getTrend(paceChange),
      current: currentWeek.avgPace,
      previous: lastWeek.avgPace
    },
    daysActive: {
      change: Math.round(daysActiveChange),
      trend: getTrend(daysActiveChange),
      current: currentWeek.daysActive,
      previous: lastWeek.daysActive
    }
  };
};

/**
 * Get daily breakdown for the current week
 * @param {Array} sessions - All swim sessions
 * @returns {Array} Array of 7 days (Mon-Sun) with session counts
 */
export const getWeeklyDayBreakdown = (sessions) => {
  const { start } = getCurrentWeekBounds();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return days.map((dayName, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateStr = date.toDateString();

    const daySessions = sessions.filter(s =>
      new Date(s.date).toDateString() === dateStr
    );

    return {
      day: dayName,
      date: dateStr,
      count: daySessions.length,
      totalDistance: daySessions.reduce((sum, s) => sum + (s.distance || 0), 0),
      hasActivity: daySessions.length > 0
    };
  });
};
