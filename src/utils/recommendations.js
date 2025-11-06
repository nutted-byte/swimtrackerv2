/**
 * Recommendation generation utilities
 */

import { calculateStreak } from './streakCalculation';
import { calculateMomentum } from './momentumCalculation';
import { getCurrentWeekStats } from './weeklyStats';

/**
 * Generate detailed recommendations based on analysis
 * @param {Object} analysis - Deep analysis results
 * @param {Array} allSessions - All sessions for streak/momentum context
 * @returns {Array} Array of recommendation objects
 */
export const generateDetailedRecommendations = (analysis, allSessions = []) => {
  const recommendations = [];

  if (!analysis) return recommendations;

  const { pacing, fatigue, comparative, patterns } = analysis;

  // Get streak and momentum for context-aware recommendations
  const streak = allSessions.length > 0 ? calculateStreak(allSessions) : 0;
  const momentum = allSessions.length > 0 ? calculateMomentum(allSessions) : null;
  const weekStats = allSessions.length > 0 ? getCurrentWeekStats(allSessions) : null;

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

  // ========== NEW: Streak-aware recommendations (weekly streaks) ==========
  if (streak >= 8) {
    recommendations.push({
      category: 'motivation',
      priority: 'positive',
      title: `${streak}-Week Streak!`,
      message: `You've swum every week for ${streak} weeks! That's ${Math.floor(streak / 4)} months of consistency.`,
      action: 'Keep up the weekly routine - consistency is key'
    });
  } else if (streak >= 4) {
    recommendations.push({
      category: 'motivation',
      priority: 'positive',
      title: `${streak}-Week Streak Going Strong!`,
      message: `You're building excellent weekly consistency. ${streak < 12 ? 'Keep it up to hit 3 months!' : 'Amazing dedication!'}`,
      action: 'Schedule your swim for this week to maintain the streak'
    });
  }

  // ========== NEW: Momentum-based recommendations ==========
  if (momentum && momentum.trend === 'down' && momentum.percentage < -20) {
    recommendations.push({
      category: 'motivation',
      priority: 'medium',
      title: 'Get Back on Track',
      message: `Training dipped ${Math.abs(momentum.percentage)}% recently. Small consistent swims will rebuild momentum.`,
      action: 'Aim for 2-3 shorter sessions this week to rebuild consistency'
    });
  } else if (momentum && momentum.trend === 'up' && momentum.percentage > 20) {
    recommendations.push({
      category: 'motivation',
      priority: 'positive',
      title: 'Momentum Building!',
      message: `Training is up ${momentum.percentage}% - you're crushing it! Watch for signs of overtraining.`,
      action: 'Include at least one easy/recovery swim this week'
    });
  }

  // ========== NEW: Weekly training recommendations (adjusted for weekly swimmers) ==========
  if (weekStats && weekStats.count === 0 && new Date().getDay() >= 3) {
    recommendations.push({
      category: 'consistency',
      priority: 'medium',
      title: 'No Swim This Week Yet',
      message: 'Haven\'t swum this week. Try to get one session in to maintain your streak!',
      action: 'Schedule a swim before Sunday'
    });
  }

  // ========== NEW: Forward-looking guidance based on patterns ==========
  if (patterns?.bestDay && patterns.bestTime && analysis.daysSinceLastSwim >= 2) {
    const nextBestDay = patterns.bestDay.dayName;
    const bestTime = patterns.bestTime.time;
    recommendations.push({
      category: 'timing',
      priority: 'low',
      title: 'Optimize Your Next Swim',
      message: `It's been ${analysis.daysSinceLastSwim} days. You typically perform best on ${nextBestDay}s in the ${bestTime}.`,
      action: `Schedule your next swim for a ${nextBestDay} ${bestTime}`
    });
  }

  // If been away for a while (>5 days), suggest easy comeback swim
  if (analysis.daysSinceLastSwim >= 5) {
    recommendations.push({
      category: 'comeback',
      priority: 'medium',
      title: 'Welcome Back!',
      message: `${analysis.daysSinceLastSwim} days since last swim. Start with an easy session to rebuild.`,
      action: 'Do 60-70% of your normal distance at comfortable pace'
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
