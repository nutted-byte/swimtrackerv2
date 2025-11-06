/**
 * Streak achievements and milestones
 * Defines and checks for streak-based achievements
 */

/**
 * Streak milestone definitions (in months)
 */
export const STREAK_MILESTONES = [
  { months: 3, badge: 'Quarter Year', emoji: '🌱', message: '3-month streak! You\'re building a habit' },
  { months: 6, badge: 'Half Year', emoji: '⚡', message: '6 months! Consistency is key' },
  { months: 12, badge: 'Full Year', emoji: '🔥', message: '1 year! You\'re on fire' },
  { months: 18, badge: 'Year & Half', emoji: '💪', message: '18 months! Incredible dedication' },
  { months: 24, badge: 'Two Years', emoji: '🌟', message: '2 years! You\'re unstoppable' },
  { months: 36, badge: 'Three Years', emoji: '👑', message: '3 years! Elite level commitment' },
  { months: 48, badge: 'Four Year Legend', emoji: '🏆', message: '4 years! Legendary consistency' }
];

/**
 * Check which streak achievements have been unlocked
 * @param {number} currentStreak - Current streak in months
 * @param {Array} sessions - All sessions for additional checks
 * @returns {Array} Array of unlocked achievements
 */
export const checkStreakAchievements = (currentStreak, sessions = []) => {
  const unlocked = [];

  STREAK_MILESTONES.forEach(milestone => {
    if (currentStreak >= milestone.months) {
      unlocked.push({
        ...milestone,
        unlockedAt: currentStreak,
        isNew: currentStreak === milestone.months // True if just unlocked this month
      });
    }
  });

  return unlocked;
};

/**
 * Get the next streak milestone to aim for
 * @param {number} currentStreak - Current streak in months
 * @returns {Object|null} Next milestone or null if at max
 */
export const getNextStreakMilestone = (currentStreak) => {
  const nextMilestone = STREAK_MILESTONES.find(m => m.months > currentStreak);

  if (!nextMilestone) {
    // Already at highest milestone
    return null;
  }

  const monthsToGo = nextMilestone.months - currentStreak;
  const progressPercent = (currentStreak / nextMilestone.months) * 100;

  return {
    ...nextMilestone,
    monthsToGo,
    progressPercent: Math.round(progressPercent),
    message: monthsToGo === 1
      ? '1 month away from your next milestone!'
      : `${monthsToGo} months away from ${nextMilestone.badge}`
  };
};

/**
 * Get all achievements (both unlocked and locked)
 * @param {number} currentStreak - Current streak in months
 * @returns {Array} Array of all achievements with locked/unlocked status
 */
export const getAllAchievements = (currentStreak) => {
  return STREAK_MILESTONES.map(milestone => ({
    ...milestone,
    unlocked: currentStreak >= milestone.months,
    progress: currentStreak >= milestone.months
      ? 100
      : Math.round((currentStreak / milestone.months) * 100)
  }));
};

/**
 * Check if a milestone was just reached (for displaying celebration)
 * @param {number} currentStreak - Current streak in months
 * @param {number} previousStreak - Previous streak (e.g., last month's)
 * @returns {Object|null} Newly unlocked milestone or null
 */
export const checkNewMilestone = (currentStreak, previousStreak) => {
  const newlyUnlocked = STREAK_MILESTONES.find(
    m => currentStreak >= m.months && previousStreak < m.months
  );

  return newlyUnlocked || null;
};

/**
 * Get streak achievement summary
 * @param {number} currentStreak - Current streak in months
 * @param {Array} sessions - All sessions
 * @returns {Object} Achievement summary
 */
export const getStreakAchievementSummary = (currentStreak, sessions = []) => {
  const unlocked = checkStreakAchievements(currentStreak, sessions);
  const nextMilestone = getNextStreakMilestone(currentStreak);
  const allAchievements = getAllAchievements(currentStreak);

  return {
    totalUnlocked: unlocked.length,
    totalAchievements: STREAK_MILESTONES.length,
    percentComplete: Math.round((unlocked.length / STREAK_MILESTONES.length) * 100),
    unlocked,
    nextMilestone,
    allAchievements
  };
};

/**
 * Get motivational message based on current streak
 * @param {number} currentStreak - Current streak in months
 * @returns {string} Motivational message
 */
export const getStreakMotivation = (currentStreak) => {
  if (currentStreak === 0) {
    return "Start your streak today! Every journey begins with a single swim.";
  } else if (currentStreak < 3) {
    return `${currentStreak} month${currentStreak > 1 ? 's' : ''} down! Keep the monthly routine going!`;
  } else if (currentStreak < 6) {
    return `${currentStreak} months strong! Building a solid habit!`;
  } else if (currentStreak < 12) {
    return `${currentStreak} months! Almost a full year of consistency!`;
  } else if (currentStreak < 24) {
    return `${currentStreak} months! Over a year! You're building serious momentum!`;
  } else if (currentStreak < 36) {
    return `${currentStreak} months! You're in elite territory!`;
  } else {
    return `${currentStreak} months! LEGENDARY status achieved! 👑`;
  }
};
