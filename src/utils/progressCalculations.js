/**
 * Get start of current week (Monday)
 */
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Calculate weekly progress toward goal
 */
export const calculateWeeklyProgress = (sessions, goalMeters = 7500) => {
  const weekStart = getStartOfWeek();
  weekStart.setHours(0, 0, 0, 0);

  const weeklyDistance = sessions
    .filter(session => new Date(session.date) >= weekStart)
    .reduce((sum, session) => sum + session.distance, 0);

  const percentage = Math.min((weeklyDistance / goalMeters) * 100, 100);
  const remaining = Math.max(goalMeters - weeklyDistance, 0);
  const isGoalMet = weeklyDistance >= goalMeters;

  return {
    current: weeklyDistance,
    goal: goalMeters,
    percentage,
    remaining,
    isGoalMet
  };
};

/**
 * Calculate monthly progress
 */
export const calculateMonthlyProgress = (sessions, goalMeters = 30000) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyDistance = sessions
    .filter(session => new Date(session.date) >= monthStart)
    .reduce((sum, session) => sum + session.distance, 0);

  const percentage = Math.min((monthlyDistance / goalMeters) * 100, 100);
  const remaining = Math.max(goalMeters - monthlyDistance, 0);

  return {
    current: monthlyDistance,
    goal: goalMeters,
    percentage,
    remaining,
    isGoalMet: monthlyDistance >= goalMeters
  };
};
