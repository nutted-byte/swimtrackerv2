/**
 * Lap-level analysis utilities for pacing and fatigue detection
 */

/**
 * Detect pacing strategy from lap data
 * @param {Array} laps - Array of lap objects with pace/time data
 * @returns {Object} { strategy: 'negative'|'positive'|'even'|'erratic', consistency, variation }
 */
export const detectPacingStrategy = (laps) => {
  if (!laps || laps.length < 3) {
    return { strategy: 'unknown', consistency: 0, variation: 0 };
  }

  // Extract pace data from laps (converting to seconds per 100m if needed)
  const paces = laps
    .map(lap => {
      // Handle different lap data formats
      if (lap.avgPace) return lap.avgPace * 60; // Convert to seconds
      if (lap.pace) return lap.pace * 60;
      if (lap.duration && lap.distance) {
        return (lap.duration * 60) / (lap.distance / 100); // seconds per 100m
      }
      return null;
    })
    .filter(p => p !== null && p > 0);

  if (paces.length < 3) {
    return { strategy: 'unknown', consistency: 0, variation: 0 };
  }

  // Calculate variation (coefficient of variation)
  const meanPace = paces.reduce((sum, p) => sum + p, 0) / paces.length;
  const variance = paces.reduce((sum, p) => sum + Math.pow(p - meanPace, 2), 0) / paces.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / meanPace) * 100;

  // Split into thirds to detect pacing pattern
  const third = Math.floor(paces.length / 3);
  const firstThird = paces.slice(0, third);
  const lastThird = paces.slice(-third);

  const avgFirst = firstThird.reduce((sum, p) => sum + p, 0) / firstThird.length;
  const avgLast = lastThird.reduce((sum, p) => sum + p, 0) / lastThird.length;

  const paceChange = ((avgLast - avgFirst) / avgFirst) * 100;

  // Determine strategy
  let strategy;
  if (cv > 15) {
    strategy = 'erratic'; // High variation
  } else if (paceChange < -3) {
    strategy = 'negative'; // Negative split (getting faster)
  } else if (paceChange > 3) {
    strategy = 'positive'; // Positive split (getting slower)
  } else {
    strategy = 'even'; // Consistent pace
  }

  // Consistency score (0-100, higher is better)
  const consistency = Math.max(0, Math.min(100, 100 - cv * 5));

  return {
    strategy,
    consistency: Math.round(consistency),
    variation: Math.round(cv),
    paceChange: Math.round(paceChange),
    avgPace: meanPace / 60 // Convert back to minutes
  };
};

/**
 * Calculate fatigue index from lap data
 * @param {Array} laps - Array of lap objects
 * @returns {Object} { fatigueIndex: number, fadingLaps: number, description: string }
 */
export const calculateFatigueIndex = (laps) => {
  if (!laps || laps.length < 5) {
    return { fatigueIndex: 0, fadingLaps: 0, description: 'Insufficient data' };
  }

  const paces = laps
    .map(lap => {
      if (lap.avgPace) return lap.avgPace * 60;
      if (lap.pace) return lap.pace * 60;
      if (lap.duration && lap.distance) {
        return (lap.duration * 60) / (lap.distance / 100);
      }
      return null;
    })
    .filter(p => p !== null && p > 0);

  if (paces.length < 5) {
    return { fatigueIndex: 0, fadingLaps: 0, description: 'Insufficient data' };
  }

  // Use first 3 laps as baseline (after warmup)
  const baselinePace = paces.slice(1, 4).reduce((sum, p) => sum + p, 0) / 3;

  // Check last third for fatigue
  const lastThird = Math.floor(paces.length / 3);
  const finalLaps = paces.slice(-lastThird);

  // Count how many final laps are significantly slower than baseline
  const fadingLaps = finalLaps.filter(pace => pace > baselinePace * 1.05).length;

  // Calculate average slowdown in final laps
  const avgFinalPace = finalLaps.reduce((sum, p) => sum + p, 0) / finalLaps.length;
  const fatigueIndex = ((avgFinalPace - baselinePace) / baselinePace) * 100;

  let description;
  if (fatigueIndex < 2) {
    description = 'Excellent endurance - minimal fatigue';
  } else if (fatigueIndex < 5) {
    description = 'Good pacing - slight slowdown at end';
  } else if (fatigueIndex < 10) {
    description = 'Moderate fatigue - consider pacing strategy';
  } else {
    description = 'Significant fatigue - focus on endurance';
  }

  return {
    fatigueIndex: Math.round(fatigueIndex),
    fadingLaps,
    description,
    baselinePace: baselinePace / 60,
    finalPace: avgFinalPace / 60
  };
};
