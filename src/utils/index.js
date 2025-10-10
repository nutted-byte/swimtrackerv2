/**
 * Analytics utilities index - re-exports all analytics functions
 * This file provides backward compatibility and a single import point
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
export { detectPacingStrategy, calculateFatigueIndex } from './lapAnalysis.js';

// Patterns
export { findPerformancePatterns } from './patterns.js';

// Recommendations
export { generateDetailedRecommendations } from './recommendations.js';

// Achievements
export { checkAchievementBadges, generateFunComparisons } from './achievements.js';

// Ranking
export { calculateSwimRanking } from './ranking.js';

// Questions
export { generateSwimQuestions, answerSwimQuestion } from './questions.js';

// Deep Analysis
export { analyzeLastSwimDeep } from './deepAnalysis.js';
