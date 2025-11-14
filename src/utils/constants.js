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

// Chart styling - Single source of truth for chart colors
export const CHART_COLORS = {
  // Primary colors
  PRIMARY: '#00d4ff',      // accent-blue - main chart lines/bars
  SECONDARY: '#a78bfa',    // purple-400 - secondary lines, rolling avg
  TREND: '#f97316',        // orange-500 - trend lines
  COMPARE: '#6b7280',      // gray-500 - comparison data
  SUCCESS: '#10b981',      // green-500 - positive/improving
  WARNING: '#f59e0b',      // yellow-500 - warning states
  DANGER: '#ef4444',       // red-500 - negative/declining
  MILESTONE: '#fbbf24',    // yellow-400 - milestone markers

  // Chart UI elements
  GRID: '#1f2937',         // gray-800 - grid lines
  AXIS: '#6b7280',         // gray-500 - axis lines and text
  AXIS_LIGHT: '#9ca3af',   // gray-400 - lighter axis text
  BORDER: '#374151',       // gray-700 - borders and dividers
};

// Export/Share image colors - Used for html2canvas image generation
// These must be hex values since they're used in inline styles for image export
export const EXPORT_COLORS = {
  // Background colors
  BG_DARK: '#0a0e27',           // Dark background
  BG_DARK_ALT: '#1a2332',       // Dark background variation
  BG_DARK_ALT2: '#0f1728',      // Dark background variation 2
  BG_LIGHT: '#ffffff',          // White background
  BG_LIGHT_ALT: '#f3f4f6',      // Light gray background

  // Text colors
  TEXT_PRIMARY: '#ffffff',      // White text
  TEXT_SECONDARY: '#d1d5db',    // gray-300
  TEXT_TERTIARY: '#9ca3af',     // gray-400
  TEXT_MUTED: '#6b7280',        // gray-500
  TEXT_DARK: '#1f2937',         // gray-800 (for light backgrounds)

  // Brand colors
  BRAND_PRIMARY: '#007d9b',     // primary-500 (teal)
  BRAND_SECONDARY: '#3397af',   // primary-400
  BRAND_ACCENT: '#00d4ff',      // accent-blue
  BRAND_TEAL: '#66b1c3',        // Teal accent

  // Gradient colors
  GRADIENT_PURPLE: '#667eea',
  GRADIENT_PURPLE_DARK: '#764ba2',
  GRADIENT_PINK: '#f093fb',
  GRADIENT_BLUE: '#4facfe',
  GRADIENT_CYAN: '#00f2fe',
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
