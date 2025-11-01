/**
 * Sample Training Plan Data
 *
 * This is a hardcoded 8-week training plan for testing the MVP.
 * Represents Maria's persona: beginner training to swim 1500m continuous
 */

import { GOAL_TYPES, USER_LEVELS, PLAN_STATUS, DAYS_OF_WEEK } from '../types/trainingPlan';

/**
 * Sample 8-week training plan: "Build to 1500m Continuous"
 * For: Milestone Maria persona
 * Goal: Progress from 800m to 1500m continuous swimming
 */
export const sampleTrainingPlan = {
  id: 'plan_sample_1500m',
  userId: 'user_123', // Will be replaced with actual user ID
  createdAt: new Date('2025-02-01'),
  startDate: new Date('2025-02-03'),
  endDate: new Date('2025-03-31'),

  goal: {
    type: GOAL_TYPES.DISTANCE,
    current: 800,
    target: 1500,
    timeline: 8,
    description: 'Swim 1500m continuous'
  },

  userLevel: USER_LEVELS.BEGINNER,
  frequency: 3,
  sessionLength: 45,

  status: PLAN_STATUS.ACTIVE,

  progress: {
    currentWeek: 2,
    completedWorkouts: 3,
    totalWorkouts: 24,
    percentComplete: 12.5,
    streak: 2,
    longestStreak: 3
  },

  settings: {
    emailReminders: true,
    adaptiveDifficulty: false,
    preferredDays: 'monday,wednesday,friday'
  },

  weeks: [
    // WEEK 1: Foundation
    {
      weekNumber: 1,
      focus: 'Foundation Building',
      description: 'Get comfortable with consistent swimming and proper breathing rhythm',
      totalDistance: 2600,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w1_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Easy Endurance Builder',
          warmup: [
            '200m easy swim, focus on relaxed breathing',
            '4x50m kick with 20s rest between'
          ],
          mainSet: [
            '4x200m @ comfortable pace',
            'Rest 45 seconds between each',
            'Focus: Find your breathing rhythm, don\'t rush'
          ],
          cooldown: [
            '100m easy swim',
            'Stretch poolside for 5 minutes'
          ],
          totalDistance: 1100,
          estimatedTime: 35,
          targetPace: 2.8,
          completed: true,
          completedAt: new Date('2025-02-03'),
          actualPerformance: {
            distance: 1100,
            duration: 38,
            pace: 2.9
          }
        },
        {
          id: 'w1_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: 'Technique & Form',
          warmup: [
            '300m mix of freestyle and choice stroke',
            '6x25m drill (catch-up drill) with 15s rest'
          ],
          mainSet: [
            '10x100m with focus on technique',
            'Rest 30 seconds between',
            'Odd reps: Focus on high elbow catch',
            'Even reps: Focus on hip rotation'
          ],
          cooldown: [
            '200m easy, celebrate your effort!'
          ],
          totalDistance: 1000,
          estimatedTime: 40,
          targetPace: 2.7,
          completed: true,
          completedAt: new Date('2025-02-05'),
          actualPerformance: {
            distance: 1000,
            duration: 42,
            pace: 2.8
          }
        },
        {
          id: 'w1_s3',
          day: DAYS_OF_WEEK.FRIDAY,
          title: 'Steady Distance',
          warmup: [
            '400m easy with bilateral breathing (every 3rd stroke)'
          ],
          mainSet: [
            '3x300m @ steady pace',
            'Rest 60 seconds between',
            'Goal: Maintain consistent pace across all 3'
          ],
          cooldown: [
            '100m backstroke easy'
          ],
          totalDistance: 1400,
          estimatedTime: 45,
          targetPace: 2.75,
          completed: true,
          completedAt: new Date('2025-02-07'),
          actualPerformance: {
            distance: 1400,
            duration: 44,
            pace: 2.7
          },
          notes: 'Felt strong! Breathing was much easier today.'
        }
      ]
    },

    // WEEK 2: Volume Increase
    {
      weekNumber: 2,
      focus: 'Building Volume',
      description: 'Gradually increase distance while maintaining form',
      totalDistance: 2900,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w2_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Progressive Intervals',
          warmup: [
            '300m easy choice',
            '4x50m build (start easy, finish fast) with 20s rest'
          ],
          mainSet: [
            '6x150m progressive pace',
            'Rest 40 seconds between',
            'Each rep should be slightly faster than previous',
            'Start at 2:50/100m, aim to finish at 2:30/100m'
          ],
          cooldown: [
            '200m easy freestyle'
          ],
          totalDistance: 1300,
          estimatedTime: 42,
          targetPace: 2.6,
          completed: false
        },
        {
          id: 'w2_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: 'Endurance Builder',
          warmup: [
            '400m easy mix of strokes'
          ],
          mainSet: [
            '2x500m @ comfortable sustainable pace',
            'Rest 90 seconds between',
            'Focus: Negative split (2nd half faster than 1st)'
          ],
          cooldown: [
            '100m easy'
          ],
          totalDistance: 1500,
          estimatedTime: 45,
          targetPace: 2.75,
          completed: false
        },
        {
          id: 'w2_s3',
          day: DAYS_OF_WEEK.SATURDAY,
          title: 'Weekend Long Swim',
          warmup: [
            '500m easy, vary breathing patterns (3, 5, 7 strokes per breath)'
          ],
          mainSet: [
            '1x1000m continuous!',
            'Pace: Start easy, stay relaxed',
            'This is your longest swim yet - you\'ve got this!'
          ],
          cooldown: [
            '100m easy backstroke',
            'You swam 1km without stopping! 🎉'
          ],
          totalDistance: 1600,
          estimatedTime: 50,
          targetPace: 2.8,
          completed: false
        }
      ]
    },

    // WEEK 3: Technique Focus
    {
      weekNumber: 3,
      focus: 'Efficiency & Technique',
      description: 'Refine technique to swim more efficiently',
      totalDistance: 3100,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w3_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Drill-Focused Session',
          warmup: [
            '400m easy freestyle'
          ],
          mainSet: [
            '10x100m drill & swim',
            'Odd reps: 50m drill (catch-up), 50m swim',
            'Even reps: 50m drill (fingertip drag), 50m swim',
            'Rest 25 seconds between',
            'Focus on feeling the technique changes'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1600,
          estimatedTime: 50,
          targetPace: 2.65,
          completed: false
        },
        {
          id: 'w3_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: 'SWOLF Improvement',
          warmup: [
            '300m easy',
            '6x25m build with 15s rest'
          ],
          mainSet: [
            '8x100m counting strokes per length',
            'Goal: Reduce stroke count while maintaining pace',
            'Rest 30 seconds between',
            'Lower SWOLF score = more efficient!'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1350,
          estimatedTime: 45,
          targetPace: 2.6,
          completed: false
        },
        {
          id: 'w3_s3',
          day: DAYS_OF_WEEK.FRIDAY,
          title: 'Distance Application',
          warmup: [
            '500m easy with good technique'
          ],
          mainSet: [
            '3x400m applying technique',
            'Rest 60 seconds between',
            'Focus: Maintain form for entire distance'
          ],
          cooldown: [
            '150m easy choice'
          ],
          totalDistance: 1850,
          estimatedTime: 55,
          targetPace: 2.7,
          completed: false
        }
      ]
    },

    // WEEK 4: Recovery Week
    {
      weekNumber: 4,
      focus: 'Recovery & Consolidation',
      description: 'Lower volume week to recover and absorb training',
      totalDistance: 2400,
      isRecoveryWeek: true,
      sessions: [
        {
          id: 'w4_s1',
          day: DAYS_OF_WEEK.TUESDAY,
          title: 'Easy Recovery Swim',
          warmup: [
            '400m super easy, enjoy the water'
          ],
          mainSet: [
            '6x100m easy with 30s rest',
            'No pressure, just move and feel good'
          ],
          cooldown: [
            '200m choice stroke'
          ],
          totalDistance: 1200,
          estimatedTime: 40,
          targetPace: 3.0,
          completed: false
        },
        {
          id: 'w4_s2',
          day: DAYS_OF_WEEK.FRIDAY,
          title: 'Active Recovery',
          warmup: [
            '300m easy'
          ],
          mainSet: [
            '4x200m relaxed pace',
            'Rest 45 seconds',
            'Focus on enjoying your swimming'
          ],
          cooldown: [
            '100m backstroke'
          ],
          totalDistance: 1200,
          estimatedTime: 42,
          targetPace: 2.9,
          completed: false
        }
      ]
    },

    // WEEK 5: Building Back Up
    {
      weekNumber: 5,
      focus: 'Progressive Loading',
      description: 'Build volume back up post-recovery week',
      totalDistance: 3300,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w5_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Interval Training',
          warmup: [
            '500m easy mix'
          ],
          mainSet: [
            '8x150m @ target pace',
            'Rest 35 seconds between',
            'Goal: Hold consistent 2:40/100m pace'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1900,
          estimatedTime: 50,
          targetPace: 2.6,
          completed: false
        },
        {
          id: 'w5_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: 'Endurance Push',
          warmup: [
            '400m easy'
          ],
          mainSet: [
            '1x1200m continuous',
            'Pace: Comfortable but purposeful',
            'You\'re getting close to your goal!'
          ],
          cooldown: [
            '100m easy'
          ],
          totalDistance: 1700,
          estimatedTime: 52,
          targetPace: 2.75,
          completed: false
        },
        {
          id: 'w5_s3',
          day: DAYS_OF_WEEK.SATURDAY,
          title: 'Mixed Distance',
          warmup: [
            '500m easy'
          ],
          mainSet: [
            '1x300m, 2x200m, 3x100m',
            'Descending rest (60s, 45s, 30s)',
            'Maintain same pace across all reps'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1400,
          estimatedTime: 48,
          targetPace: 2.65,
          completed: false
        }
      ]
    },

    // WEEK 6: Goal Preparation
    {
      weekNumber: 6,
      focus: 'Goal Distance Preparation',
      description: 'Practice swimming close to goal distance',
      totalDistance: 3500,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w6_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Confidence Builder',
          warmup: [
            '600m easy, feel strong'
          ],
          mainSet: [
            '1x1400m continuous!',
            'Pace: Sustainable and confident',
            'You\'re so close to 1500m!'
          ],
          cooldown: [
            '100m easy celebration swim'
          ],
          totalDistance: 2100,
          estimatedTime: 58,
          targetPace: 2.75,
          completed: false
        },
        {
          id: 'w6_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: 'Recovery Swim',
          warmup: [
            '300m easy'
          ],
          mainSet: [
            '6x100m easy with 30s rest',
            'Let your body recover for the big push'
          ],
          cooldown: [
            '100m choice'
          ],
          totalDistance: 1000,
          estimatedTime: 35,
          targetPace: 3.0,
          completed: false
        },
        {
          id: 'w6_s3',
          day: DAYS_OF_WEEK.FRIDAY,
          title: 'Mental Preparation',
          warmup: [
            '400m visualization: imagine swimming 1500m'
          ],
          mainSet: [
            '3x300m @ goal pace',
            'Rest 60 seconds',
            'Practice your race pace and mindset'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1500,
          estimatedTime: 45,
          targetPace: 2.7,
          completed: false
        }
      ]
    },

    // WEEK 7: Taper Week
    {
      weekNumber: 7,
      focus: 'Taper & Rest',
      description: 'Reduce volume, maintain intensity, prepare body for goal attempt',
      totalDistance: 2200,
      isRecoveryWeek: true,
      sessions: [
        {
          id: 'w7_s1',
          day: DAYS_OF_WEEK.TUESDAY,
          title: 'Light Maintenance',
          warmup: [
            '400m easy'
          ],
          mainSet: [
            '5x100m @ goal pace',
            'Rest 40 seconds',
            'Keep the feeling sharp but fresh'
          ],
          cooldown: [
            '200m easy'
          ],
          totalDistance: 1100,
          estimatedTime: 38,
          targetPace: 2.7,
          completed: false
        },
        {
          id: 'w7_s2',
          day: DAYS_OF_WEEK.THURSDAY,
          title: 'Final Tune-Up',
          warmup: [
            '300m easy'
          ],
          mainSet: [
            '4x200m comfortable',
            'Rest 45 seconds',
            'Feel strong and confident'
          ],
          cooldown: [
            '100m easy'
          ],
          totalDistance: 1100,
          estimatedTime: 40,
          targetPace: 2.75,
          completed: false
        }
      ]
    },

    // WEEK 8: Goal Week!
    {
      weekNumber: 8,
      focus: 'Goal Achievement',
      description: 'This is it! Time to swim 1500m continuous',
      totalDistance: 2000,
      isRecoveryWeek: false,
      sessions: [
        {
          id: 'w8_s1',
          day: DAYS_OF_WEEK.MONDAY,
          title: 'Easy Prep Swim',
          warmup: [
            '300m easy, stay loose'
          ],
          mainSet: [
            '4x100m easy with 30s rest',
            'Just moving, not working'
          ],
          cooldown: [
            '100m backstroke'
          ],
          totalDistance: 800,
          estimatedTime: 30,
          targetPace: 3.0,
          completed: false
        },
        {
          id: 'w8_s2',
          day: DAYS_OF_WEEK.WEDNESDAY,
          title: '🎯 GOAL ATTEMPT: 1500m Continuous!',
          warmup: [
            '500m easy warm-up',
            'Take your time, no rush',
            'Visualize success'
          ],
          mainSet: [
            '1x1500m CONTINUOUS! 🎉',
            'This is YOUR moment',
            'Start comfortable, stay relaxed',
            'Trust your training - you are ready',
            'Focus on breathing and rhythm',
            'You\'ve got this!'
          ],
          cooldown: [
            '200m celebration swim!',
            'YOU DID IT! 🏊‍♀️🎊'
          ],
          totalDistance: 2200,
          estimatedTime: 65,
          targetPace: 2.75,
          completed: false
        }
      ]
    }
  ]
};

/**
 * Helper function to get upcoming workouts
 * @param {TrainingPlan} plan
 * @returns {WorkoutSession[]} Next 3 upcoming workouts
 */
export const getUpcomingWorkouts = (plan) => {
  const allWorkouts = plan.weeks.flatMap(week => week.sessions);
  const upcoming = allWorkouts.filter(w => !w.completed);
  return upcoming.slice(0, 3);
};

/**
 * Helper function to get this week's workouts
 * @param {TrainingPlan} plan
 * @returns {WorkoutSession[]} Current week's workouts
 */
export const getThisWeekWorkouts = (plan) => {
  const currentWeek = plan.weeks.find(w => w.weekNumber === plan.progress.currentWeek);
  return currentWeek ? currentWeek.sessions : [];
};

/**
 * Helper function to get next incomplete workout
 * @param {TrainingPlan} plan
 * @returns {WorkoutSession | null} Next workout to complete
 */
export const getNextWorkout = (plan) => {
  const upcoming = getUpcomingWorkouts(plan);
  return upcoming.length > 0 ? upcoming[0] : null;
};
