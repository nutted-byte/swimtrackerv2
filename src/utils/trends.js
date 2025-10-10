/**
 * Trend calculation utilities for comparing performance across periods
 */

/**
 * Calculate trend percentage between two periods
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {number} Percentage change (positive = improvement)
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Calculate pace trend (note: lower pace is better)
 * @param {number} currentPace - Current average pace
 * @param {number} previousPace - Previous average pace
 * @returns {number} Percentage change (positive = improvement)
 */
export const calculatePaceTrend = (currentPace, previousPace) => {
  if (previousPace === 0) return 0;
  // Invert because lower pace is better
  return Math.round(((previousPace - currentPace) / previousPace) * 100);
};

/**
 * Calculate SWOLF trend (note: lower SWOLF is better)
 */
export const calculateSwolfTrend = (currentSwolf, previousSwolf) => {
  if (previousSwolf === 0) return 0;
  // Invert because lower SWOLF is better
  return Math.round(((previousSwolf - currentSwolf) / previousSwolf) * 100);
};
