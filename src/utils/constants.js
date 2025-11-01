/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// Time range options (in days)
export const TIME_RANGES = {
  MONTH: 30,
  QUARTER: 90,
  HALF_YEAR: 180,
  YEAR: 365,
  ALL_TIME: null, // null means no date filter
};

export const TIME_RANGE_OPTIONS = [
  { value: TIME_RANGES.MONTH, label: '1 Month' },
  { value: TIME_RANGES.QUARTER, label: '3 Months' },
  { value: TIME_RANGES.HALF_YEAR, label: '6 Months' },
  { value: TIME_RANGES.YEAR, label: '12 Months' },
  { value: TIME_RANGES.ALL_TIME, label: 'All Time' },
];

// Metric types
export const METRICS = {
  PACE: 'pace',
  DISTANCE: 'distance',
  SWOLF: 'swolf',
  STROKES: 'strokes',
  DURATION: 'duration',
};

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  AREA: 'area',
  SCATTER: 'scatter',
};

// View modes
export const VIEW_MODES = {
  LIST: 'list',
  GROUPED: 'grouped',
  GRID: 'grid',
};

// Granularity options
export const GRANULARITIES = {
  SESSION: 'session',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

export const GRANULARITY_OPTIONS = [
  { value: GRANULARITIES.SESSION, label: 'Session' },
  { value: GRANULARITIES.DAILY, label: 'Daily' },
  { value: GRANULARITIES.WEEKLY, label: 'Weekly' },
];

// Sort options
export const SORT_OPTIONS = {
  DATE_DESC: 'date-desc',
  DATE_ASC: 'date-asc',
  DISTANCE: 'distance',
  PACE: 'pace',
};

// Progress status
export const PROGRESS_STATUS = {
  IMPROVING: 'improving',
  STABLE: 'stable',
  DECLINING: 'declining',
  NO_DATA: 'no-data',
  INSUFFICIENT_DATA: 'insufficient-data',
};

// Trend thresholds
export const TREND_THRESHOLDS = {
  IMPROVING: 3,        // % improvement to show "improving"
  DECLINING: -3,       // % decline to show "declining"
  SIGNIFICANT: 5,      // % change to highlight in insights
};

// Analysis parameters
export const ANALYSIS_PARAMS = {
  MIN_SESSIONS_FOR_ANALYSIS: 2,
  MIN_SESSIONS_FOR_TRENDS: 5,
  ROLLING_AVG_WINDOW: 3,
  DEFAULT_ANALYSIS_DAYS: 30,
};

// Chart styling
export const CHART_COLORS = {
  PRIMARY: '#00d4ff',
  SECONDARY: '#a78bfa',
  TREND: '#f97316',
  COMPARE: '#6b7280',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  MILESTONE: '#fbbf24',
};

// Animation durations (ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  CHART: 800,
};

// File upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ACCEPTED_TYPES: ['.fit', '.csv'],
  MAX_FILES_PER_UPLOAD: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  SESSIONS_PER_PAGE: 50,
};

// Cache durations (ms)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 2 * 60 * 60 * 1000,  // 2 hours
};

// API configuration
export const API_CONFIG = {
  CLAUDE_MODEL: 'claude-3-5-haiku-20241022', // Fast and cheap
  // Alternative if overloaded: 'claude-3-5-sonnet-20241022' (slower but more capacity)
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.3,
};

// Swim metrics validation
export const VALIDATION = {
  MIN_DISTANCE: 25,          // meters
  MAX_DISTANCE: 10000,       // meters
  MIN_PACE: 0.5,             // min/100m
  MAX_PACE: 10,              // min/100m
  MIN_SWOLF: 20,
  MAX_SWOLF: 100,
};

// Feature flags
export const FEATURES = {
  ENABLE_RATINGS: true,
  ENABLE_LAP_ANALYSIS: true,
  ENABLE_AI_INSIGHTS: true,
  ENABLE_EXPORT: false,
  ENABLE_GOALS: false,
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'swimma-theme',
  VIEW_MODE: 'swimma-view-mode',
  CHART_PREFERENCES: 'swimma-chart-prefs',
  LAST_UPLOAD_DIR: 'swimma-last-upload-dir',
};
