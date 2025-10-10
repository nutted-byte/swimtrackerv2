/**
 * Records and milestone tracking utilities
 */

/**
 * Find personal records
 */
export const findRecords = (sessions) => {
  if (sessions.length === 0) return null;

  const records = {
    fastestPace: sessions.reduce((best, s) =>
      !best || (s.pace > 0 && s.pace < best.pace) ? s : best
    , null),
    longestDistance: sessions.reduce((best, s) =>
      !best || s.distance > best.distance ? s : best
    , null),
    bestSwolf: sessions.reduce((best, s) =>
      !best || (s.swolf > 0 && s.swolf < best.swolf) ? s : best
    , null)
  };

  return records;
};

/**
 * Find milestones in a session window
 * @param {Array} sessions - Sessions to analyze
 * @returns {Object} Milestone sessions and values
 */
export const findMilestones = (sessions) => {
  if (!sessions || sessions.length === 0) return null;

  const validPaceSessions = sessions.filter(s => s.pace > 0);
  const validSwolfSessions = sessions.filter(s => s.swolf > 0);

  return {
    bestPace: validPaceSessions.length > 0
      ? validPaceSessions.reduce((best, s) => !best || s.pace < best.pace ? s : best, null)
      : null,
    longestSwim: sessions.reduce((best, s) => !best || s.distance > best.distance ? s : best, null),
    bestSwolf: validSwolfSessions.length > 0
      ? validSwolfSessions.reduce((best, s) => !best || s.swolf < best.swolf ? s : best, null)
      : null,
    highestCalories: sessions.reduce((best, s) =>
      !best || (s.calories || 0) > (best.calories || 0) ? s : best, null
    )
  };
};

/**
 * Calculate next milestone targets for records
 * @param {Object} records - Current records (fastestPace, longestDistance, bestSwolf, etc.)
 * @param {Array} sessions - All sessions for context
 * @returns {Array} Array of next milestone objects with progress
 */
export const calculateNextMilestones = (records, sessions) => {
  const milestones = [];

  // Pace milestones (every 5 seconds improvement)
  if (records.fastestPace && records.fastestPace.pace > 0) {
    const currentPaceSeconds = records.fastestPace.pace * 60; // Convert to seconds per 100m
    const targetPaceSeconds = Math.floor(currentPaceSeconds / 5) * 5; // Round down to nearest 5 seconds
    const nextTarget = targetPaceSeconds > 0 ? targetPaceSeconds : currentPaceSeconds - 5;

    if (nextTarget < currentPaceSeconds) {
      const progress = ((currentPaceSeconds - nextTarget) / (currentPaceSeconds - nextTarget + (currentPaceSeconds - nextTarget))) * 100;
      milestones.push({
        type: 'pace',
        title: 'Faster Pace',
        current: records.fastestPace.pace,
        target: nextTarget / 60, // Convert back to minutes
        unit: 'min/100m',
        progress: Math.min(95, ((currentPaceSeconds - nextTarget) / currentPaceSeconds) * 100),
        displayCurrent: `${Math.floor(records.fastestPace.pace)}:${Math.round((records.fastestPace.pace % 1) * 60).toString().padStart(2, '0')}`,
        displayTarget: `${Math.floor(nextTarget / 60)}:${(nextTarget % 60).toString().padStart(2, '0')}`,
        message: `You're ${((currentPaceSeconds - nextTarget) % 5) || 5} seconds away from your next pace milestone!`,
        icon: 'Zap'
      });
    }
  }

  // Distance milestones (round numbers: 1km, 2km, 3km, etc.)
  if (records.longestDistance) {
    const currentKm = records.longestDistance.distance / 1000;
    const nextTargetKm = Math.ceil(currentKm * 2) / 2; // Next 0.5km milestone
    const progress = (currentKm / nextTargetKm) * 100;

    if (nextTargetKm > currentKm) {
      milestones.push({
        type: 'distance',
        title: 'Longer Swim',
        current: records.longestDistance.distance,
        target: nextTargetKm * 1000,
        unit: 'km',
        progress,
        displayCurrent: `${currentKm.toFixed(2)} km`,
        displayTarget: `${nextTargetKm.toFixed(1)} km`,
        message: `Just ${((nextTargetKm - currentKm) * 1000).toFixed(0)}m more to hit ${nextTargetKm}km!`,
        icon: 'TrendingUp'
      });
    }
  }

  // SWOLF milestone (every 5 points improvement)
  if (records.bestSwolf && records.bestSwolf.swolf > 0) {
    const currentSwolf = records.bestSwolf.swolf;
    const nextTarget = Math.floor((currentSwolf - 1) / 5) * 5;
    const progress = ((currentSwolf - nextTarget) / 5) * 100;

    if (nextTarget < currentSwolf && nextTarget > 0) {
      milestones.push({
        type: 'swolf',
        title: 'Better Efficiency',
        current: currentSwolf,
        target: nextTarget,
        unit: 'SWOLF',
        progress,
        displayCurrent: currentSwolf.toString(),
        displayTarget: nextTarget.toString(),
        message: `${currentSwolf - nextTarget} points away from SWOLF ${nextTarget}!`,
        icon: 'Target'
      });
    }
  }

  // Total distance milestone (every 10km)
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalKm = totalDistance / 1000;
  const nextTotalKm = Math.ceil(totalKm / 10) * 10;
  const totalProgress = (totalKm / nextTotalKm) * 100;

  if (nextTotalKm > totalKm) {
    milestones.push({
      type: 'total',
      title: 'Total Distance',
      current: totalDistance,
      target: nextTotalKm * 1000,
      unit: 'km total',
      progress: totalProgress,
      displayCurrent: `${totalKm.toFixed(1)} km`,
      displayTarget: `${nextTotalKm} km`,
      message: `${((nextTotalKm - totalKm) * 1000).toFixed(0)}m until you hit ${nextTotalKm}km total!`,
      icon: 'Award'
    });
  }

  // Sort by progress (closest to completion first)
  return milestones
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3); // Return top 3 closest milestones
};
