/**
 * Training Plan Type Definitions
 *
 * Provides structured training plans for swimmers to achieve their goals
 */

/**
 * @typedef {'distance' | 'pace' | 'event' | 'fitness'} GoalType
 * @typedef {'beginner' | 'intermediate' | 'advanced'} UserLevel
 * @typedef {'active' | 'completed' | 'abandoned' | 'paused'} PlanStatus
 * @typedef {'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'} DayOfWeek
 */

/**
 * Training Goal Configuration
 * @typedef {Object} TrainingGoal
 * @property {GoalType} type - Type of goal
 * @property {number} current - Current level (distance in meters or pace in min/100m)
 * @property {number} target - Target level to achieve
 * @property {number} timeline - Duration in weeks
 * @property {string} [description] - Human-readable goal description
 */

/**
 * Individual Workout Session
 * @typedef {Object} WorkoutSession
 * @property {string} id - Unique workout identifier
 * @property {DayOfWeek} day - Day of week for this workout
 * @property {string} title - Workout title
 * @property {string[]} warmup - Warm-up instructions
 * @property {string[]} mainSet - Main set instructions
 * @property {string[]} cooldown - Cool-down instructions
 * @property {number} totalDistance - Total distance in meters
 * @property {number} estimatedTime - Estimated time in minutes
 * @property {number} [targetPace] - Target pace in min/100m (optional)
 * @property {boolean} completed - Whether workout is completed
 * @property {string} [actualSwimId] - ID of actual swim session (if completed)
 * @property {Date} [completedAt] - When workout was completed
 * @property {Object} [actualPerformance] - Actual performance data
 * @property {number} [actualPerformance.distance] - Actual distance swum
 * @property {number} [actualPerformance.duration] - Actual duration
 * @property {number} [actualPerformance.pace] - Actual pace
 * @property {string} [notes] - User notes about the workout
 */

/**
 * Training Week
 * @typedef {Object} TrainingWeek
 * @property {number} weekNumber - Week number (1-based)
 * @property {string} focus - Focus theme for the week
 * @property {string} [description] - Detailed description of week's goals
 * @property {WorkoutSession[]} sessions - Workout sessions for this week
 * @property {number} totalDistance - Total distance for the week
 * @property {boolean} isRecoveryWeek - Whether this is a recovery week
 */

/**
 * Training Plan Progress
 * @typedef {Object} PlanProgress
 * @property {number} currentWeek - Current week number
 * @property {number} completedWorkouts - Number of completed workouts
 * @property {number} totalWorkouts - Total number of workouts
 * @property {number} percentComplete - Percentage complete (0-100)
 * @property {number} streak - Current workout completion streak (days)
 * @property {number} longestStreak - Longest workout streak
 */

/**
 * Complete Training Plan
 * @typedef {Object} TrainingPlan
 * @property {string} id - Unique plan identifier
 * @property {string} userId - User ID (from auth context)
 * @property {Date} createdAt - When plan was created
 * @property {Date} startDate - When plan starts/started
 * @property {Date} endDate - Planned end date
 * @property {TrainingGoal} goal - Training goal configuration
 * @property {UserLevel} userLevel - User's experience level
 * @property {number} frequency - Swims per week
 * @property {number} sessionLength - Typical session length in minutes
 * @property {TrainingWeek[]} weeks - Weekly breakdown of training
 * @property {PlanStatus} status - Current status of the plan
 * @property {PlanProgress} progress - Progress tracking
 * @property {Object} [settings] - Optional plan settings
 * @property {boolean} [settings.emailReminders] - Send email reminders
 * @property {boolean} [settings.adaptiveDifficulty] - Auto-adjust based on performance
 * @property {string} [settings.preferredDays] - Preferred workout days
 */

/**
 * Plan Creation Parameters
 * @typedef {Object} PlanCreationParams
 * @property {GoalType} goalType
 * @property {number} current
 * @property {number} target
 * @property {number} timeline
 * @property {UserLevel} userLevel
 * @property {number} frequency
 * @property {number} sessionLength
 * @property {Date} startDate
 * @property {Object[]} [recentSwims] - Recent swim history for context
 */

// Export helper constants
export const GOAL_TYPES = {
  DISTANCE: 'distance',
  PACE: 'pace',
  EVENT: 'event',
  FITNESS: 'fitness'
};

export const USER_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const PLAN_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  PAUSED: 'paused'
};

export const DAYS_OF_WEEK = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday'
};
