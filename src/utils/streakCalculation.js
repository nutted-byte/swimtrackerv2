/**
 * Get month key (YYYY-MM) for a given date
 */
const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Calculate current swim streak (consecutive months with at least one swim)
 */
export const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;

  // Group sessions by month
  const monthMap = new Map();
  sessions.forEach(session => {
    const monthKey = getMonthKey(new Date(session.date));
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey).push(session);
  });

  // Sort months (newest first)
  const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b.localeCompare(a));

  // Calculate streak from current month backwards
  let streak = 0;
  const now = new Date();

  for (let i = 0; i < sortedMonths.length; i++) {
    const expectedDate = new Date(now.getFullYear(), now.getMonth() - streak, 1);
    const expectedMonthKey = getMonthKey(expectedDate);

    if (sortedMonths[i] === expectedMonthKey) {
      streak++;
    } else {
      // There's a gap - streak is broken
      break;
    }
  }

  return streak;
};

/**
 * Get last 7 days activity with intensity levels
 */
export const getLast7DaysActivity = (sessions) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    const daySessions = sessions.filter(s =>
      new Date(s.date).toDateString() === dateStr
    );

    const hasActivity = daySessions.length > 0;
    const totalDistance = hasActivity
      ? daySessions.reduce((sum, s) => sum + s.distance, 0)
      : 0;

    // Intensity: 0 (none), 1 (light <2km), 2 (moderate 2-3km), 3 (heavy >3km)
    let intensity = 0;
    if (hasActivity) {
      const distanceKm = totalDistance / 1000;
      if (distanceKm > 3) intensity = 3;
      else if (distanceKm > 2) intensity = 2;
      else intensity = 1;
    }

    days.push({
      date: dateStr,
      dayLetter: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      hasActivity,
      intensity,
      totalDistance
    });
  }

  return days;
};

/**
 * Get last 12 months activity with session counts and metrics
 */
export const getLast12MonthsActivity = (sessions) => {
  const months = [];
  const today = new Date();

  // Generate last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    // Count sessions in this month
    const monthSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
    });

    const hasActivity = monthSessions.length > 0;
    const totalDistance = hasActivity
      ? monthSessions.reduce((sum, s) => sum + s.distance, 0)
      : 0;

    // Calculate total lengths (assuming 25m pool)
    const totalLengths = hasActivity
      ? Math.round(totalDistance / 25)
      : 0;

    // Calculate averages
    const avgPace = hasActivity
      ? monthSessions.reduce((sum, s) => sum + (s.pace || 0), 0) / monthSessions.length
      : 0;

    const avgSwolf = hasActivity
      ? monthSessions.reduce((sum, s) => sum + (s.swolf || 0), 0) / monthSessions.length
      : 0;

    months.push({
      monthKey,
      monthName,
      hasActivity,
      sessionCount: monthSessions.length,
      totalDistance,
      totalLengths,
      avgPace,
      avgSwolf,
      isCurrentMonth: i === 0
    });
  }

  return months;
};
