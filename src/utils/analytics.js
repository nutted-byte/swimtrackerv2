/**
 * Analytics module - re-exports all swim analytics utilities
 * This file maintains backward compatibility for existing imports
 * All analytics functions have been split into focused modules
 */

// Summary
export { groupSessionsByMonth, generateSwimSummary } from './summary.js';

// Trends
export { calculateTrend, calculatePaceTrend, calculateSwolfTrend } from './trends.js';

// Progress
export { analyzeProgress, generateCoachingInsight } from './progress.js';

// Records
export { findRecords, findMilestones, calculateNextMilestones } from './records.js';

// Statistics
export { calculateRollingAverage, calculateDateRollingAverage, calculateLinearRegression, calculateConsistencyScore } from './statistics.js';

// Aggregations
export { aggregateByDay, aggregateByWeek } from './aggregations.js';

// Streaks
export { calculateStreaks } from './streaks.js';

// Comparisons
export { getCompareData } from './comparisons.js';

// Lap Analysis
export { detectPacingStrategy, calculateFatigueIndex } from './analytics/lapAnalysis.js';

// Patterns
export { findPerformancePatterns } from './patterns.js';

// Recommendations
export { generateDetailedRecommendations } from './recommendations.js';

// Achievements
export { checkAchievementBadges, generateFunComparisons } from './achievements.js';

// Ranking
export { calculateSwimRanking } from './ranking.js';

// Questions
export { generateSwimQuestions, answerSwimQuestion } from './ai/questions.js';

// Deep Analysis
export { analyzeLastSwimDeep } from './analytics/deepAnalysis.js';
