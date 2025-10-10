/**
 * Achievement and gamification utilities
 */

import { calculateStreaks } from './streaks.js';

/**
 * Check which achievement badges the swimmer has earned
 * @param {Array} sessions - All swim sessions
 * @param {Object} records - Personal records
 * @returns {Array} Array of badge objects with earned status
 */
export const checkAchievementBadges = (sessions, records) => {
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalSwims = sessions.length;
  const streaks = calculateStreaks(sessions);

  const badges = [
    // Distance Badges
    {
      id: 'first-km',
      category: 'distance',
      name: 'First Kilometer',
      description: 'Swim your first 1km',
      icon: '🏊',
      earned: records.longestDistance && records.longestDistance.distance >= 1000,
      progress: records.longestDistance ? Math.min(100, (records.longestDistance.distance / 1000) * 100) : 0
    },
    {
      id: 'marathon-swimmer',
      category: 'distance',
      name: 'Marathon Swimmer',
      description: 'Complete a 5km swim',
      icon: '🏅',
      earned: records.longestDistance && records.longestDistance.distance >= 5000,
      progress: records.longestDistance ? Math.min(100, (records.longestDistance.distance / 5000) * 100) : 0
    },
    {
      id: 'century',
      category: 'cumulative',
      name: 'Century Club',
      description: 'Swim 100km total',
      icon: '💯',
      earned: totalDistance >= 100000,
      progress: Math.min(100, (totalDistance / 100000) * 100)
    },

    // Consistency Badges
    {
      id: 'getting-started',
      category: 'consistency',
      name: 'Getting Started',
      description: 'Complete 10 swims',
      icon: '🎯',
      earned: totalSwims >= 10,
      progress: Math.min(100, (totalSwims / 10) * 100)
    },
    {
      id: 'dedicated',
      category: 'consistency',
      name: 'Dedicated Swimmer',
      description: 'Complete 50 swims',
      icon: '⭐',
      earned: totalSwims >= 50,
      progress: Math.min(100, (totalSwims / 50) * 100)
    },
    {
      id: 'streak-2',
      category: 'consistency',
      name: 'On a Roll',
      description: 'Maintain a 2-week streak',
      icon: '🔥',
      earned: streaks.currentStreak >= 2 || streaks.longestStreak >= 2,
      progress: Math.min(100, (Math.max(streaks.currentStreak, streaks.longestStreak) / 2) * 100)
    },
    {
      id: 'streak-8',
      category: 'consistency',
      name: 'Unstoppable',
      description: 'Maintain an 8-week streak',
      icon: '🔥🔥',
      earned: streaks.currentStreak >= 8 || streaks.longestStreak >= 8,
      progress: Math.min(100, (Math.max(streaks.currentStreak, streaks.longestStreak) / 8) * 100)
    },

    // Speed Badges
    {
      id: 'speedster',
      category: 'speed',
      name: 'Speedster',
      description: 'Swim under 2:00/100m pace',
      icon: '⚡',
      earned: records.fastestPace && records.fastestPace.pace < 2.0,
      progress: records.fastestPace && records.fastestPace.pace > 0
        ? Math.min(100, (1 - (records.fastestPace.pace - 1.5) / 0.5) * 100)
        : 0
    },
    {
      id: 'efficiency',
      category: 'efficiency',
      name: 'Efficiency Expert',
      description: 'Achieve SWOLF under 40',
      icon: '✨',
      earned: records.bestSwolf && records.bestSwolf.swolf < 40,
      progress: records.bestSwolf && records.bestSwolf.swolf > 0
        ? Math.min(100, (1 - (records.bestSwolf.swolf - 35) / 10) * 100)
        : 0
    },

    // Special Badges
    {
      id: 'early-bird',
      category: 'special',
      name: 'Early Bird',
      description: 'Swim before 6 AM',
      icon: '🌅',
      earned: sessions.some(s => new Date(s.date).getHours() < 6),
      progress: sessions.some(s => new Date(s.date).getHours() < 6) ? 100 : 0
    },
    {
      id: 'night-owl',
      category: 'special',
      name: 'Night Owl',
      description: 'Swim after 10 PM',
      icon: '🦉',
      earned: sessions.some(s => new Date(s.date).getHours() >= 22),
      progress: sessions.some(s => new Date(s.date).getHours() >= 22) ? 100 : 0
    },
    {
      id: 'weekend-warrior',
      category: 'special',
      name: 'Weekend Warrior',
      description: 'Complete 10 swims on weekends',
      icon: '🏖️',
      earned: sessions.filter(s => {
        const day = new Date(s.date).getDay();
        return day === 0 || day === 6;
      }).length >= 10,
      progress: Math.min(100, (sessions.filter(s => {
        const day = new Date(s.date).getDay();
        return day === 0 || day === 6;
      }).length / 10) * 100)
    }
  ];

  return badges;
};

/**
 * Generate fun comparisons for total stats
 * @param {Array} sessions - All sessions
 * @returns {Object} Fun comparison data
 */
export const generateFunComparisons = (sessions) => {
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalStrokes = sessions.reduce((sum, s) => sum + s.strokes, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  const comparisons = {
    distance: [],
    strokes: [],
    duration: []
  };

  // Distance comparisons
  const pools = Math.round(totalDistance / 25); // 25m pool lengths
  const olympicPools = (totalDistance / 50).toFixed(1); // 50m Olympic pools
  const englishChannel = (totalDistance / 33800).toFixed(2); // ~33.8km

  comparisons.distance = [
    {
      label: 'Pool Lengths',
      value: pools.toLocaleString(),
      icon: '🏊',
      description: `That's ${pools} lengths of a 25m pool!`
    },
    {
      label: 'Olympic Pools',
      value: olympicPools,
      icon: '🏊‍♂️',
      description: `${olympicPools} lengths of an Olympic pool`
    }
  ];

  if (totalDistance >= 33800) {
    comparisons.distance.push({
      label: 'English Channel',
      value: `${englishChannel}x`,
      icon: '🌊',
      description: 'The English Channel!'
    });
  } else if (totalDistance >= 3800) {
    const manhattanSwim = (totalDistance / 48280).toFixed(2); // ~48.3km around Manhattan
    comparisons.distance.push({
      label: 'Around Manhattan',
      value: `${(totalDistance / 48280 * 100).toFixed(0)}%`,
      icon: '🗽',
      description: `${(totalDistance / 48280 * 100).toFixed(0)}% of swimming around Manhattan`
    });
  }

  // Stroke comparisons
  if (totalStrokes > 0) {
    const strokesPerHour = totalDuration > 0 ? Math.round(totalStrokes / (totalDuration / 60)) : 0;

    comparisons.strokes = [
      {
        label: 'Total Strokes',
        value: totalStrokes.toLocaleString(),
        icon: '💪',
        description: `${totalStrokes.toLocaleString()} arm movements!`
      }
    ];

    if (strokesPerHour > 0) {
      comparisons.strokes.push({
        label: 'Strokes per Hour',
        value: strokesPerHour.toLocaleString(),
        icon: '⏱️',
        description: `Averaging ${strokesPerHour.toLocaleString()} strokes/hour`
      });
    }

    // Fun comparison: If they waved that many times
    if (totalStrokes > 10000) {
      comparisons.strokes.push({
        label: 'Wave Comparison',
        value: `${(totalStrokes / 1000).toFixed(1)}k`,
        icon: '👋',
        description: `If you waved this many times, your arm would fall off!`
      });
    }
  }

  // Duration comparisons
  if (totalDuration > 0) {
    const hours = Math.floor(totalDuration / 60);
    const movies = (totalDuration / 120).toFixed(1); // Average movie ~2 hours

    comparisons.duration = [
      {
        label: 'Total Time',
        value: `${hours}h ${totalDuration % 60}m`,
        icon: '⏰',
        description: `${hours} hours in the pool!`
      },
      {
        label: 'Movies Worth',
        value: movies,
        icon: '🎬',
        description: `That's ${movies} movies!`
      }
    ];

    if (hours > 100) {
      const days = (hours / 24).toFixed(1);
      comparisons.duration.push({
        label: 'Days',
        value: days,
        icon: '📅',
        description: `${days} days swimming!`
      });
    }
  }

  return comparisons;
};
