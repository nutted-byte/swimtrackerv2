/**
 * Common formatting utilities used across the application
 * Centralizes all data formatting logic to reduce duplication
 */

/**
 * Format pace as minutes:seconds per 100m
 * @param {number} pace - Pace in minutes (decimal)
 * @returns {string} Formatted pace (e.g., "2:15")
 */
export const formatPace = (pace) => {
  if (!pace || pace <= 0) return '--';
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format distance in meters to kilometers
 * @param {number} meters - Distance in meters
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted distance (e.g., "1.25")
 */
export const formatDistance = (meters, decimals = 2) => {
  if (!meters || meters <= 0) return '0';
  return (meters / 1000).toFixed(decimals);
};

/**
 * Format date in various styles
 * @param {string|Date} dateString - Date to format
 * @param {string} style - 'short', 'medium', 'long' (default: 'short')
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, style = 'short') => {
  const date = new Date(dateString);

  switch (style) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'medium':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  }
};

/**
 * Format date for chart display (compact)
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date (e.g., "Jan 15")
 */
export const formatChartDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format duration in minutes to hours and minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0 min';

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format number with comma separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format percentage with sign
 * @param {number} percent - Percentage value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage (e.g., "+5.2%")
 */
export const formatPercent = (percent, decimals = 1) => {
  if (percent === null || percent === undefined) return '0%';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(decimals)}%`;
};

/**
 * Format SWOLF score (efficiency metric)
 * @param {number} swolf - SWOLF value
 * @returns {string} Formatted SWOLF
 */
export const formatSwolf = (swolf) => {
  if (!swolf || swolf <= 0) return '--';
  return Math.round(swolf).toString();
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} dateString - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return formatDate(dateString, 'short');
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
