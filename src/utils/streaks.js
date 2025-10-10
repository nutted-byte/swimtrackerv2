/**
 * Streak tracking utilities for swim consistency
 */

/**
 * Calculate active swim streaks (consecutive weeks with swims)
 * @param {Array} sessions - All sessions sorted by date
 * @returns {Object} Current and longest streak info
 */
export const calculateStreaks = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, streakWeeks: [] };
  }

  // Sort by date ascending
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get unique weeks with swims
  const weekSet = new Set();
  sorted.forEach(session => {
    const date = new Date(session.date);
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const weekKey = monday.toISOString().split('T')[0];
    weekSet.add(weekKey);
  });

  const weeks = Array.from(weekSet).sort();
  if (weeks.length === 0) {
    return { currentStreak: 0, longestStreak: 0, streakWeeks: [] };
  }

  // Calculate streaks
  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < weeks.length; i++) {
    const prevWeek = new Date(weeks[i - 1]);
    const currWeek = new Date(weeks[i]);
    const diffDays = (currWeek - prevWeek) / (1000 * 60 * 60 * 24);

    // Check if consecutive weeks (7 days apart)
    if (diffDays === 7) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (check if most recent week is current or last week)
  const now = new Date();
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  const mostRecentWeek = new Date(weeks[weeks.length - 1]);

  if (mostRecentWeek >= lastMonday) {
    // Current streak is active
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak,
    streakWeeks: weeks
  };
};
