/**
 * Performance pattern detection utilities
 */

/**
 * Find performance patterns based on time/day
 * @param {Array} sessions - All sessions
 * @returns {Object} Pattern analysis
 */
export const findPerformancePatterns = (sessions) => {
  if (!sessions || sessions.length < 5) {
    return { hasPatterns: false, message: 'Need more data to identify patterns' };
  }

  // Group by day of week
  const dayGroups = {};
  const hourGroups = {};

  sessions.forEach(session => {
    if (!session.pace || session.pace === 0) return;

    const date = new Date(session.date);
    const day = date.getDay(); // 0-6
    const hour = date.getHours();

    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(session.pace);

    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    if (!hourGroups[timeOfDay]) hourGroups[timeOfDay] = [];
    hourGroups[timeOfDay].push(session.pace);
  });

  // Calculate averages for each day
  const dayAverages = Object.entries(dayGroups)
    .map(([day, paces]) => ({
      day: parseInt(day),
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(day)],
      avgPace: paces.reduce((sum, p) => sum + p, 0) / paces.length,
      count: paces.length
    }))
    .filter(d => d.count >= 2); // Only include days with at least 2 sessions

  // Find best day
  const bestDay = dayAverages.length > 0
    ? dayAverages.reduce((best, d) => !best || d.avgPace < best.avgPace ? d : best, null)
    : null;

  // Calculate time of day averages
  const timeAverages = Object.entries(hourGroups)
    .map(([time, paces]) => ({
      time,
      avgPace: paces.reduce((sum, p) => sum + p, 0) / paces.length,
      count: paces.length
    }))
    .filter(t => t.count >= 2);

  const bestTime = timeAverages.length > 0
    ? timeAverages.reduce((best, t) => !best || t.avgPace < best.avgPace ? t : best, null)
    : null;

  return {
    hasPatterns: true,
    bestDay,
    bestTime,
    dayAverages,
    timeAverages
  };
};
