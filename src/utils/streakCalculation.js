/**
 * Calculate current swim streak (consecutive days with swims)
 */
export const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map(s => new Date(s.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  const uniqueDates = [...new Set(sortedDates)];

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = new Date(uniqueDates[i]);
    sessionDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === streak) {
      streak++;
    } else if (dayDiff > streak) {
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
 * Get last 30 days activity with intensity levels
 */
export const getLast30DaysActivity = (sessions) => {
  const weeks = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group into 4 weeks (roughly 30 days)
  for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
    const weekData = {
      days: [],
      weekLabel: weekIndex === 0 ? 'This week' : `${weekIndex + 1} weeks ago`
    };

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const daysBack = weekIndex * 7 + (6 - dayIndex);
      const date = new Date(today);
      date.setDate(date.getDate() - daysBack);
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

      weekData.days.push({
        date: dateStr,
        dayLetter: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
        hasActivity,
        intensity,
        totalDistance
      });
    }

    weeks.push(weekData);
  }

  return weeks.reverse(); // Oldest first
};
