/**
 * Recommendation generation utilities
 */

/**
 * Generate detailed recommendations based on analysis
 * @param {Object} analysis - Deep analysis results
 * @returns {Array} Array of recommendation objects
 */
export const generateDetailedRecommendations = (analysis) => {
  const recommendations = [];

  if (!analysis) return recommendations;

  const { pacing, fatigue, comparative, patterns } = analysis;

  // Pacing recommendations
  if (pacing?.strategy === 'positive' && pacing.paceChange > 5) {
    recommendations.push({
      category: 'pacing',
      priority: 'high',
      title: 'Manage Your Pace',
      message: 'You started too fast and slowed significantly. Try starting 5-10 seconds slower per 100m.',
      action: 'Focus on controlled starts in your next swim'
    });
  } else if (pacing?.strategy === 'negative') {
    recommendations.push({
      category: 'pacing',
      priority: 'positive',
      title: 'Excellent Pacing!',
      message: 'You executed a negative split - getting faster as you went. This shows great race strategy.',
      action: 'Keep this approach for longer distances'
    });
  } else if (pacing?.strategy === 'erratic') {
    recommendations.push({
      category: 'pacing',
      priority: 'medium',
      title: 'Improve Consistency',
      message: `Your pace varied by ${pacing.variation}%. Work on maintaining steady effort throughout.`,
      action: 'Try counting strokes per length to stay consistent'
    });
  }

  // Fatigue recommendations
  if (fatigue?.fatigueIndex > 10) {
    recommendations.push({
      category: 'endurance',
      priority: 'high',
      title: 'Build Endurance',
      message: `You slowed by ${fatigue.fatigueIndex}% in the final laps. Focus on aerobic base building.`,
      action: 'Add 1-2 longer, slower swims per week'
    });
  } else if (fatigue?.fatigueIndex < 2) {
    recommendations.push({
      category: 'endurance',
      priority: 'positive',
      title: 'Strong Finish!',
      message: 'Minimal fatigue detected. Your endurance is excellent for this distance.',
      action: 'Consider increasing distance or intensity'
    });
  }

  // Comparative recommendations
  if (comparative?.vsPB && comparative.vsPB.paceDiff > 10) {
    recommendations.push({
      category: 'performance',
      priority: 'medium',
      title: 'Gap to Personal Best',
      message: `You're ${comparative.vsPB.paceDiff.toFixed(1)}% off your PB pace. Break it down into smaller goals.`,
      action: `Target ${comparative.targetPace} pace in your next session`
    });
  } else if (comparative?.vsPB && Math.abs(comparative.vsPB.paceDiff) < 3) {
    recommendations.push({
      category: 'performance',
      priority: 'positive',
      title: 'Near Your Best!',
      message: 'You\'re swimming close to your personal best. A PR could be within reach!',
      action: 'Consider a taper and targeted effort for a new PB'
    });
  }

  // Pattern-based recommendations
  if (patterns?.bestDay && patterns.bestTime) {
    const currentDate = new Date(analysis.session.date);
    const currentDay = currentDate.getDay();
    const currentHour = currentDate.getHours();
    const currentTime = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';

    if (currentDay !== patterns.bestDay.day || currentTime !== patterns.bestTime.time) {
      recommendations.push({
        category: 'timing',
        priority: 'low',
        title: 'Optimize Your Timing',
        message: `You typically swim best on ${patterns.bestDay.dayName}s in the ${patterns.bestTime.time}.`,
        action: 'Schedule key workouts during your peak performance windows'
      });
    }
  }

  // Consistency recommendations
  if (pacing?.consistency < 70) {
    recommendations.push({
      category: 'technique',
      priority: 'medium',
      title: 'Work on Consistency',
      message: 'Your pace consistency could improve. This often comes from technique refinement.',
      action: 'Try 6x100m at target pace with focus on stroke count'
    });
  }

  // Always provide at least one general recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'general',
      priority: 'info',
      title: 'Keep Building',
      message: 'Solid swim! Continue building on this foundation with varied training.',
      action: 'Mix in some intervals or technique work next session'
    });
  }

  return recommendations;
};
