/**
 * Data aggregation utilities for grouping swim sessions
 */

/**
 * Aggregate sessions by day
 * @param {Array} sessions - Sessions to aggregate
 * @returns {Array} Daily aggregated data
 */
export const aggregateByDay = (sessions) => {
  if (!sessions || sessions.length === 0) return [];

  const dayMap = new Map();

  sessions.forEach(session => {
    const dateKey = new Date(session.date).toISOString().split('T')[0];

    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        date: dateKey,
        sessions: [],
        totalDistance: 0,
        totalDuration: 0,
        count: 0
      });
    }

    const day = dayMap.get(dateKey);
    day.sessions.push(session);
    day.totalDistance += session.distance || 0;
    day.totalDuration += session.duration || 0;
    day.count += 1;
  });

  // Calculate averages
  return Array.from(dayMap.values()).map(day => {
    const validPaces = day.sessions.filter(s => s.pace > 0);
    const validSwolfs = day.sessions.filter(s => s.swolf > 0);

    return {
      ...day,
      avgPace: validPaces.length > 0
        ? validPaces.reduce((sum, s) => sum + s.pace, 0) / validPaces.length
        : 0,
      avgSwolf: validSwolfs.length > 0
        ? validSwolfs.reduce((sum, s) => sum + s.swolf, 0) / validSwolfs.length
        : 0,
      avgDistance: day.totalDistance / day.count
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Aggregate sessions by week
 * @param {Array} sessions - Sessions to aggregate
 * @returns {Array} Weekly aggregated data
 */
export const aggregateByWeek = (sessions) => {
  if (!sessions || sessions.length === 0) return [];

  const weekMap = new Map();

  sessions.forEach(session => {
    const date = new Date(session.date);
    // Get Monday of the week
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const weekKey = monday.toISOString().split('T')[0];

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        weekStart: weekKey,
        sessions: [],
        totalDistance: 0,
        totalDuration: 0,
        count: 0
      });
    }

    const week = weekMap.get(weekKey);
    week.sessions.push(session);
    week.totalDistance += session.distance || 0;
    week.totalDuration += session.duration || 0;
    week.count += 1;
  });

  // Calculate averages
  return Array.from(weekMap.values()).map(week => {
    const validPaces = week.sessions.filter(s => s.pace > 0);
    const validSwolfs = week.sessions.filter(s => s.swolf > 0);

    return {
      ...week,
      avgPace: validPaces.length > 0
        ? validPaces.reduce((sum, s) => sum + s.pace, 0) / validPaces.length
        : 0,
      avgSwolf: validSwolfs.length > 0
        ? validSwolfs.reduce((sum, s) => sum + s.swolf, 0) / validSwolfs.length
        : 0,
      avgDistance: week.totalDistance / week.count
    };
  }).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
};
