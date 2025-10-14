/**
 * Pattern recognition utilities for analyzing swimming performance patterns
 * Identifies trends like day-of-week performance, time patterns, etc.
 */

/**
 * Analyze performance by day of week
 * @param {Array} sessions - Array of swim sessions
 * @returns {Object} Day-of-week analysis with stats and insights
 */
export const analyzeDayOfWeekPerformance = (sessions) => {
  if (sessions.length < 3) {
    return { hasSufficientData: false };
  }

  // Group sessions by day of week (0 = Sunday, 6 = Saturday)
  const dayGroups = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  sessions.forEach(session => {
    const date = new Date(session.date);
    const dayOfWeek = date.getDay();

    if (!dayGroups[dayOfWeek]) {
      dayGroups[dayOfWeek] = {
        day: dayNames[dayOfWeek],
        sessions: [],
        totalDistance: 0,
        totalDuration: 0,
        avgPace: 0,
        avgSwolf: 0,
      };
    }

    dayGroups[dayOfWeek].sessions.push(session);
    dayGroups[dayOfWeek].totalDistance += session.distance;
    dayGroups[dayOfWeek].totalDuration += session.duration;
  });

  // Calculate averages for each day
  const dayStats = Object.keys(dayGroups).map(dayOfWeek => {
    const group = dayGroups[dayOfWeek];
    const count = group.sessions.length;

    const validPaceSessions = group.sessions.filter(s => s.pace > 0);
    const validSwolfSessions = group.sessions.filter(s => s.swolf > 0);

    return {
      dayOfWeek: parseInt(dayOfWeek),
      day: group.day,
      count,
      avgDistance: group.totalDistance / count,
      avgDuration: group.totalDuration / count,
      avgPace: validPaceSessions.length > 0
        ? validPaceSessions.reduce((sum, s) => sum + s.pace, 0) / validPaceSessions.length
        : 0,
      avgSwolf: validSwolfSessions.length > 0
        ? validSwolfSessions.reduce((sum, s) => sum + s.swolf, 0) / validSwolfSessions.length
        : 0,
      totalDistance: group.totalDistance,
    };
  });

  // Sort by day of week
  dayStats.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  // Find best and worst days
  const daysWithPace = dayStats.filter(d => d.avgPace > 0);
  const daysWithSwolf = dayStats.filter(d => d.avgSwolf > 0);

  const bestPaceDay = daysWithPace.length > 0
    ? daysWithPace.reduce((best, day) => day.avgPace < best.avgPace ? day : best)
    : null;

  const worstPaceDay = daysWithPace.length > 0
    ? daysWithPace.reduce((worst, day) => day.avgPace > worst.avgPace ? day : worst)
    : null;

  const mostFrequentDay = dayStats.reduce((most, day) =>
    day.count > most.count ? day : most
  );

  const leastFrequentDay = dayStats.reduce((least, day) =>
    day.count < least.count ? day : least
  );

  // Generate insights
  const insights = [];

  if (bestPaceDay && worstPaceDay && bestPaceDay.day !== worstPaceDay.day) {
    const paceImprovement = ((worstPaceDay.avgPace - bestPaceDay.avgPace) / worstPaceDay.avgPace * 100).toFixed(1);
    insights.push({
      type: 'pace',
      severity: 'positive',
      message: `You swim ${paceImprovement}% faster on ${bestPaceDay.day}s compared to ${worstPaceDay.day}s.`,
      data: { bestDay: bestPaceDay, worstDay: worstPaceDay },
    });
  }

  if (mostFrequentDay.count >= 3) {
    insights.push({
      type: 'frequency',
      severity: 'neutral',
      message: `${mostFrequentDay.day} is your most common swim day (${mostFrequentDay.count} swims).`,
      data: mostFrequentDay,
    });
  }

  // Check for weekend vs weekday patterns
  const weekendDays = dayStats.filter(d => d.dayOfWeek === 0 || d.dayOfWeek === 6);
  const weekdayDays = dayStats.filter(d => d.dayOfWeek >= 1 && d.dayOfWeek <= 5);

  if (weekendDays.length > 0 && weekdayDays.length > 0) {
    const weekendAvgPace = weekendDays.reduce((sum, d) => sum + d.avgPace * d.count, 0) /
      weekendDays.reduce((sum, d) => sum + d.count, 0);
    const weekdayAvgPace = weekdayDays.reduce((sum, d) => sum + d.avgPace * d.count, 0) /
      weekdayDays.reduce((sum, d) => sum + d.count, 0);

    if (weekendAvgPace > 0 && weekdayAvgPace > 0) {
      const diff = Math.abs(weekendAvgPace - weekdayAvgPace);
      const pct = (diff / Math.max(weekendAvgPace, weekdayAvgPace) * 100).toFixed(1);

      if (pct > 5) {
        const better = weekendAvgPace < weekdayAvgPace ? 'weekends' : 'weekdays';
        insights.push({
          type: 'weekend-vs-weekday',
          severity: 'neutral',
          message: `You tend to swim ${pct}% faster on ${better}.`,
          data: { weekendAvgPace, weekdayAvgPace },
        });
      }
    }
  }

  return {
    hasSufficientData: true,
    dayStats,
    bestPaceDay,
    worstPaceDay,
    mostFrequentDay,
    leastFrequentDay,
    insights,
  };
};

/**
 * Detect performance streaks (improving, declining, or consistent)
 * @param {Array} sessions - Array of swim sessions (sorted newest first)
 * @param {number} minStreak - Minimum number of sessions for a streak
 * @returns {Object} Streak analysis
 */
export const detectPerformanceStreaks = (sessions, minStreak = 3) => {
  if (sessions.length < minStreak) {
    return { hasStreak: false };
  }

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10); // Look at last 10 sessions

  let improvingStreak = 0;
  let decliningStreak = 0;
  let consistentStreak = 0;

  for (let i = 1; i < recentSessions.length; i++) {
    const prev = recentSessions[i - 1];
    const curr = recentSessions[i];

    if (!prev.pace || !curr.pace) continue;

    const paceChange = ((prev.pace - curr.pace) / prev.pace) * 100;

    if (paceChange > 2) {
      // Improving (pace getting faster)
      improvingStreak++;
      decliningStreak = 0;
      consistentStreak = 0;
    } else if (paceChange < -2) {
      // Declining (pace getting slower)
      decliningStreak++;
      improvingStreak = 0;
      consistentStreak = 0;
    } else {
      // Consistent
      consistentStreak++;
      improvingStreak = 0;
      decliningStreak = 0;
    }
  }

  const hasStreak = Math.max(improvingStreak, decliningStreak, consistentStreak) >= minStreak;

  let streakType = null;
  let streakLength = 0;
  let message = null;

  if (improvingStreak >= minStreak) {
    streakType = 'improving';
    streakLength = improvingStreak + 1;
    message = `You're on an improving streak! ${streakLength} consecutive swims with better pace.`;
  } else if (decliningStreak >= minStreak) {
    streakType = 'declining';
    streakLength = decliningStreak + 1;
    message = `Your pace has been slower for ${streakLength} consecutive swims. Consider rest or technique work.`;
  } else if (consistentStreak >= minStreak) {
    streakType = 'consistent';
    streakLength = consistentStreak + 1;
    message = `Great consistency! ${streakLength} swims with similar pace.`;
  }

  return {
    hasStreak,
    streakType,
    streakLength,
    message,
  };
};

/**
 * Analyze monthly patterns and trends
 * @param {Array} sessions - Array of swim sessions
 * @returns {Object} Monthly pattern analysis
 */
export const analyzeMonthlyPatterns = (sessions) => {
  if (sessions.length < 6) {
    return { hasSufficientData: false };
  }

  // Group by month
  const monthGroups = {};

  sessions.forEach(session => {
    const date = new Date(session.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = {
        sessions: [],
        totalDistance: 0,
      };
    }

    monthGroups[monthKey].sessions.push(session);
    monthGroups[monthKey].totalDistance += session.distance;
  });

  // Calculate monthly stats
  const monthStats = Object.entries(monthGroups).map(([monthKey, data]) => {
    const validPaceSessions = data.sessions.filter(s => s.pace > 0);

    return {
      month: monthKey,
      count: data.sessions.length,
      totalDistance: data.totalDistance,
      avgPace: validPaceSessions.length > 0
        ? validPaceSessions.reduce((sum, s) => sum + s.pace, 0) / validPaceSessions.length
        : 0,
    };
  }).sort((a, b) => a.month.localeCompare(b.month));

  // Find best and worst months
  const monthsWithData = monthStats.filter(m => m.count >= 2);

  if (monthsWithData.length === 0) {
    return { hasSufficientData: false };
  }

  const bestMonth = monthsWithData.reduce((best, month) =>
    month.avgPace > 0 && (best.avgPace === 0 || month.avgPace < best.avgPace) ? month : best
  );

  const mostActiveMonth = monthsWithData.reduce((most, month) =>
    month.count > most.count ? month : most
  );

  return {
    hasSufficientData: true,
    monthStats,
    bestMonth,
    mostActiveMonth,
  };
};
