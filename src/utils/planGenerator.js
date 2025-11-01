import { GOAL_TYPES, USER_LEVELS, DAYS_OF_WEEK, PLAN_STATUS } from '../types/trainingPlan';
import { generateFullTrainingPlan } from './ai/llmQuery';

/**
 * Round distance to nearest pool length multiple
 * @param {number} distance - Distance in meters
 * @param {number} poolLength - Pool length (25m or 50m)
 * @returns {number} Rounded distance
 */
const roundToPoolLength = (distance, poolLength = 25) => {
  return Math.round(distance / poolLength) * poolLength;
};

/**
 * Generate a personalized training plan based on user inputs
 * Primarily uses AI, falls back to algorithmic generation if AI fails
 * @param {Object} formData - Form data from PlanCreationWizard
 * @returns {Promise<TrainingPlan>} - Generated training plan
 */
export const generateTrainingPlan = async (formData) => {
  const {
    goalType,
    currentValue,
    targetValue,
    timeline = 8,
    eventName,
    eventDate,
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25,
    startDate
  } = formData;

  console.log('Starting plan generation with:', { goalType, currentValue, targetValue, experienceLevel, timeline });

  // Try AI-powered generation first
  const aiResult = await generateFullTrainingPlan({
    goalType,
    currentValue,
    targetValue,
    timeline,
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength
  });

  let weeks;
  let overview;
  let aiGenerated = false;

  if (aiResult.success && aiResult.planStructure) {
    console.log('Using AI-generated plan');
    // Use AI-generated structure
    weeks = aiResult.planStructure.weeks.map(week => ({
      ...week,
      sessions: week.sessions.map(session => ({
        id: `w${week.weekNumber}_s${week.sessions.indexOf(session) + 1}`,
        ...session,
        completed: false,
        completedAt: null,
        actualPerformance: null
      }))
    }));
    overview = aiResult.planStructure.overview;
    aiGenerated = true;
  } else {
    console.log('AI generation failed, using algorithmic fallback');
    // Fall back to algorithmic generation (with fixed bugs)
    const weeklyVolume = calculateWeeklyVolume(currentValue, targetValue, experienceLevel, goalType, timeline);
    const sessionDistribution = distributeSessionsPerWeek(daysPerWeek);

    weeks = [];
    for (let weekNum = 1; weekNum <= timeline; weekNum++) {
      // Adjust recovery weeks based on timeline
      const isRecoveryWeek = (timeline >= 6 && weekNum === Math.floor(timeline / 2)) ||
                             (timeline >= 8 && weekNum === timeline - 1);
      const weekData = generateWeek(
        weekNum,
        weeklyVolume,
        sessionDistribution,
        experienceLevel,
        minutesPerSession,
        goalType,
        currentValue,
        targetValue,
        isRecoveryWeek,
        poolLength
      );
      weeks.push(weekData);
    }
    overview = `Your personalized ${timeline}-week plan progressively builds toward your goal.`;
  }

  // Create goal description
  const goalDescription = createGoalDescription(goalType, targetValue, eventName);

  // Build the plan (using snake_case for Supabase)
  const plan = {
    id: `plan_${Date.now()}`,
    user_id: null, // Will be set by context
    goal: {
      type: goalType,
      description: goalDescription,
      target: targetValue,
      current: currentValue,
      event_name: eventName || null,
      event_date: eventDate || null
    },
    experience_level: experienceLevel,
    availability: {
      days_per_week: daysPerWeek,
      minutes_per_session: minutesPerSession,
      pool_length: poolLength
    },
    start_date: startDate || new Date(),
    weeks,
    status: PLAN_STATUS.ACTIVE,
    overview, // AI-generated or default overview
    ai_generated: aiGenerated, // Flag indicating if AI generation succeeded
    progress: {
      current_week: 1,
      completed_workouts: 0,
      total_workouts: weeks.reduce((sum, w) => sum + w.sessions.length, 0),
      percent_complete: 0,
      streak: 0,
      longest_streak: 0
    },
    created_at: new Date(),
    updated_at: new Date()
  };

  console.log('Generated plan:', plan);
  return plan;
};

/**
 * Calculate weekly volume progression
 * For DISTANCE goals: current/target are per-session values
 * For PACE goals: Not applicable (pace doesn't have "weekly volume")
 */
const calculateWeeklyVolume = (current, target, experienceLevel, goalType, numWeeks = 8) => {
  // Values are already in meters, no conversion needed
  const baseVolume = current;
  const targetVolume = target;
  const volumeIncrease = targetVolume - baseVolume;

  // Progressive increase over specified weeks with recovery
  const weeks = [];
  for (let i = 1; i <= numWeeks; i++) {
    // Determine if this is a recovery week (mid-point and near end)
    const isRecoveryWeek = (numWeeks >= 6 && i === Math.floor(numWeeks / 2)) ||
                           (numWeeks >= 8 && i === numWeeks - 1);

    if (isRecoveryWeek) {
      // Recovery weeks - reduce volume
      weeks.push(baseVolume + (volumeIncrease * (i - 2) / numWeeks) * 0.7);
    } else {
      weeks.push(baseVolume + (volumeIncrease * i / numWeeks));
    }
  }

  return weeks;
};

/**
 * Distribute sessions across the week
 */
const distributeSessionsPerWeek = (daysPerWeek) => {
  const allDays = [
    DAYS_OF_WEEK.MONDAY,
    DAYS_OF_WEEK.TUESDAY,
    DAYS_OF_WEEK.WEDNESDAY,
    DAYS_OF_WEEK.THURSDAY,
    DAYS_OF_WEEK.FRIDAY,
    DAYS_OF_WEEK.SATURDAY,
    DAYS_OF_WEEK.SUNDAY
  ];

  // Optimal distribution patterns
  const patterns = {
    1: [DAYS_OF_WEEK.SATURDAY],
    2: [DAYS_OF_WEEK.TUESDAY, DAYS_OF_WEEK.SATURDAY],
    3: [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.SATURDAY],
    4: [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SUNDAY],
    5: [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.TUESDAY, DAYS_OF_WEEK.THURSDAY, DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SUNDAY],
    6: allDays.slice(0, 6),
    7: allDays
  };

  return patterns[daysPerWeek] || patterns[1];
};

/**
 * Generate a single week of training (algorithmic fallback)
 */
const generateWeek = (
  weekNumber,
  weeklyVolume,
  sessionDays,
  experienceLevel,
  minutesPerSession,
  goalType,
  currentValue,
  targetValue,
  isRecoveryWeek,
  poolLength = 25
) => {
  const totalWeekVolume = weeklyVolume[weekNumber - 1];
  const sessionsCount = sessionDays.length;

  // Distribute volume across sessions (longer main sessions, shorter recovery sessions)
  const sessionVolumes = distributeVolumeAcrossSessions(totalWeekVolume, sessionsCount);

  // Generate sessions for this week
  const sessions = sessionDays.map((day, index) => {
    const sessionDistance = roundToPoolLength(sessionVolumes[index], poolLength);

    // Determine session type - vary based on week and session position
    let sessionType;
    if (sessionsCount === 1) {
      // For 1x/week, cycle through types across weeks
      const typeIndex = (weekNumber - 1) % 3;
      sessionType = ['endurance', 'mixed', 'technique'][typeIndex];
    } else if (sessionsCount === 2) {
      // For 2x/week, alternate between types
      sessionType = index === 0 ? 'endurance' : 'technique';
    } else {
      // For 3+ days, use position-based logic
      sessionType = index === 0 ? 'endurance' : index === sessionsCount - 1 ? 'technique' : 'mixed';
    }

    return generateSession(
      weekNumber,
      index + 1,
      day,
      sessionDistance,
      minutesPerSession,
      experienceLevel,
      goalType,
      isRecoveryWeek,
      sessionType,
      poolLength
    );
  });

  const focus = getWeekFocus(weekNumber, isRecoveryWeek, goalType);
  const coachingTip = getWeekCoachingTip(weekNumber, isRecoveryWeek, goalType);

  return {
    weekNumber,
    focus,
    coachingTip,
    sessions,
    totalDistance: sessions.reduce((sum, s) => sum + s.totalDistance, 0)
  };
};

/**
 * Distribute volume across sessions in a week
 */
const distributeVolumeAcrossSessions = (totalVolume, sessionsCount) => {
  const volumes = [];

  if (sessionsCount === 1) {
    volumes.push(totalVolume);
  } else if (sessionsCount === 2) {
    volumes.push(totalVolume * 0.5, totalVolume * 0.5);
  } else if (sessionsCount === 3) {
    volumes.push(totalVolume * 0.4, totalVolume * 0.35, totalVolume * 0.25);
  } else if (sessionsCount === 4) {
    volumes.push(totalVolume * 0.3, totalVolume * 0.3, totalVolume * 0.25, totalVolume * 0.15);
  } else {
    // Equal distribution for 5+ days
    const equal = totalVolume / sessionsCount;
    for (let i = 0; i < sessionsCount; i++) {
      volumes.push(equal);
    }
  }

  return volumes;
};

/**
 * Generate a single training session
 */
const generateSession = (
  weekNumber,
  sessionNumber,
  day,
  totalDistance,
  minutesPerSession,
  experienceLevel,
  goalType,
  isRecoveryWeek,
  sessionType,
  poolLength = 25
) => {
  // Cap distance based on available time (assuming ~2.5 min/100m average pace)
  // This accounts for warmup, main set, cooldown, and rest periods
  const maxDistance = Math.floor((minutesPerSession / 2.5) * 100);
  const cappedDistance = roundToPoolLength(Math.min(totalDistance, maxDistance), poolLength);

  const warmupDistance = roundToPoolLength(cappedDistance * 0.2, poolLength);
  const cooldownDistance = roundToPoolLength(cappedDistance * 0.15, poolLength);
  const mainSetDistance = cappedDistance - warmupDistance - cooldownDistance;

  // Generate workout components
  const warmup = generateWarmup(warmupDistance, experienceLevel, poolLength);
  const mainSet = generateMainSet(mainSetDistance, sessionType, experienceLevel, goalType, isRecoveryWeek, poolLength);
  const cooldown = generateCooldown(cooldownDistance, poolLength);

  // Estimate time (assuming ~2.5 min/100m pace for moderate swimming)
  const estimatedTime = Math.round((cappedDistance / 1000) * 25);

  // Calculate target pace based on goal
  const targetPace = calculateTargetPace(goalType, cappedDistance);

  return {
    id: `w${weekNumber}_s${sessionNumber}`,
    day,
    title: generateSessionTitle(sessionType, isRecoveryWeek),
    warmup,
    mainSet,
    cooldown,
    totalDistance: cappedDistance,
    estimatedTime: Math.min(estimatedTime, minutesPerSession),
    targetPace,
    completed: false,
    completedAt: null,
    actualPerformance: null
  };
};

/**
 * Generate warmup routine
 */
const generateWarmup = (distance, experienceLevel, poolLength = 25) => {
  const warmup = [];

  if (distance >= 400) {
    const swimDist = roundToPoolLength(distance - 200, poolLength);
    warmup.push(`${swimDist}m easy swim, focus on relaxed breathing`);
    warmup.push(`4x50m kick with board (20s rest)`);
  } else if (distance >= 300) {
    const swimDist = roundToPoolLength(distance * 0.7, poolLength);
    const kickDist = roundToPoolLength(distance - swimDist, poolLength);
    warmup.push(`${swimDist}m easy swim`);
    warmup.push(`${kickDist}m easy kick (no board if comfortable)`);
  } else if (distance >= 200) {
    warmup.push(`${distance}m easy swim with relaxed breathing`);
  } else if (distance >= 100) {
    warmup.push(`${distance}m very easy swim`);
    warmup.push(`Focus on feeling the water and loosening up`);
  } else {
    warmup.push(`${distance}m easy, focus on technique`);
  }

  return warmup;
};

/**
 * Generate main set based on session type
 */
const generateMainSet = (distance, sessionType, experienceLevel, goalType, isRecoveryWeek, poolLength = 25) => {
  const mainSet = [];

  if (isRecoveryWeek) {
    // Recovery - continuous easy swimming
    if (distance >= 1000) {
      const intervalDist = roundToPoolLength(400, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m @ easy pace`);
      mainSet.push(`Rest 30 seconds between each`);
    } else {
      mainSet.push(`${distance}m continuous easy swimming`);
      mainSet.push(`Focus on smooth technique`);
    }
    return mainSet;
  }

  // Regular training sessions
  if (sessionType === 'endurance') {
    // Endurance session - longer intervals or continuous
    if (distance >= 1500) {
      const intervalDist = roundToPoolLength(500, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m @ steady pace`);
      mainSet.push(`Rest 45 seconds between each`);
    } else if (distance >= 1000) {
      const intervalDist = roundToPoolLength(400, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m @ comfortable pace`);
      mainSet.push(`Rest 40 seconds between each`);
    } else if (distance >= 600) {
      // Medium distance endurance
      const intervalDist = roundToPoolLength(200, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m @ steady pace`);
      mainSet.push(`Rest 30 seconds between each`);
      mainSet.push(`Focus on breathing rhythm and stroke efficiency`);
    } else {
      // Short distance endurance
      mainSet.push(`${distance}m continuous swimming`);
      mainSet.push(`Maintain steady rhythm, focus on long strokes`);
    }
  } else if (sessionType === 'technique') {
    // Technique session - drills and focus
    if (distance >= 600) {
      const drillDistance = roundToPoolLength(distance * 0.5, poolLength);
      const swimDistance = roundToPoolLength(distance - drillDistance, poolLength);

      mainSet.push(`${drillDistance}m technique drills:`);
      mainSet.push(`- Catch-up drill (focus on reach and entry)`);
      mainSet.push(`- Single-arm drill (build strength and feel)`);
      mainSet.push(`${swimDistance}m swim applying drill focus`);
      mainSet.push(`Rest as needed to maintain good form`);
    } else if (distance >= 400) {
      const intervalDist = roundToPoolLength(100, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m alternating:`);
      mainSet.push(`- Drill (fingertip drag, catch-up, 6-kick-switch)`);
      mainSet.push(`- Swim with drill focus`);
      mainSet.push(`Rest 20s between each ${intervalDist}m`);
    } else {
      mainSet.push(`${distance}m technique focus:`);
      mainSet.push(`Alternate ${poolLength}m drill / ${poolLength}m swim`);
      mainSet.push(`Focus on high elbow catch and smooth rotation`);
    }
  } else {
    // Mixed session - intervals and pace work
    if (distance >= 1000) {
      const baseIntervalSize = experienceLevel === USER_LEVELS.BEGINNER ? 100 :
                          experienceLevel === USER_LEVELS.INTERMEDIATE ? 200 : 300;
      const intervalSize = roundToPoolLength(baseIntervalSize, poolLength);
      const sets = Math.floor(distance / intervalSize);
      mainSet.push(`${sets}x${intervalSize}m @ moderate effort`);
      mainSet.push(`Rest 20-30 seconds between intervals`);
      if (goalType === GOAL_TYPES.PACE) {
        mainSet.push(`Focus on consistent pacing throughout`);
      }
    } else if (distance >= 600) {
      // Pyramid or ladder set
      const base = roundToPoolLength(distance / 6, poolLength);
      mainSet.push(`Pyramid: ${base}m - ${base * 2}m - ${base * 3}m - ${base * 2}m - ${base}m`);
      mainSet.push(`Build effort as distance increases`);
      mainSet.push(`Rest 20s between each`);
    } else if (distance >= 400) {
      // Short intervals
      const intervalDist = roundToPoolLength(50, poolLength);
      const sets = Math.floor(distance / intervalDist);
      mainSet.push(`${sets}x${intervalDist}m @ strong effort`);
      mainSet.push(`Rest 15 seconds between each`);
      mainSet.push(`Focus on quick turnover and power`);
    } else {
      // Very short - focus on quality
      mainSet.push(`${distance}m as ${poolLength}m fast / ${poolLength}m easy`);
      mainSet.push(`Push the fast ${poolLength}s, recover on easy ones`);
    }
  }

  return mainSet;
};

/**
 * Generate cooldown routine
 */
const generateCooldown = (distance, poolLength = 25) => {
  return [
    `${distance}m easy swim`,
    `Slow down gradually, focus on long strokes`
  ];
};

/**
 * Get week focus description
 */
const getWeekFocus = (weekNumber, isRecoveryWeek, goalType) => {
  if (isRecoveryWeek) {
    return 'Recovery & Technique';
  }

  const focuses = {
    1: 'Building Base Endurance',
    2: 'Aerobic Development',
    3: 'Increasing Volume',
    4: 'Recovery & Form',
    5: 'Speed Endurance',
    6: 'Threshold Training',
    7: 'Recovery & Refinement',
    8: 'Peak & Taper'
  };

  return focuses[weekNumber] || 'Steady Progress';
};

/**
 * Get week coaching tip (fallback when AI not used)
 */
const getWeekCoachingTip = (weekNumber, isRecoveryWeek, goalType) => {
  if (isRecoveryWeek) {
    return 'Use recovery weeks to perfect your technique and let your body adapt';
  }

  const tips = {
    1: 'Focus on technique over speed - build good habits from the start',
    2: 'Maintain steady breathing patterns and find your rhythm',
    3: 'Embrace the increased volume gradually - consistency is key',
    4: 'Recovery week: focus on form and mental preparation',
    5: 'Add controlled speed while maintaining technique',
    6: 'Push your comfort zone with focused interval work',
    7: 'Recovery week: sharpen technique and prepare for final push',
    8: 'Trust your training - you\'re ready for your goal'
  };

  return tips[weekNumber] || 'Stay consistent and trust the process';
};

/**
 * Create goal description
 */
const createGoalDescription = (goalType, targetValue, eventName) => {
  if (goalType === GOAL_TYPES.EVENT && eventName) {
    return `Train for ${eventName}`;
  } else if (goalType === GOAL_TYPES.DISTANCE) {
    return `Build to ${targetValue}m continuous swim`;
  } else if (goalType === GOAL_TYPES.PACE) {
    return `Improve pace to ${targetValue} min/100m`;
  }
  return 'Improve swimming fitness';
};

/**
 * Calculate target pace for session
 */
const calculateTargetPace = (goalType, distance) => {
  // Base pace estimate (min/100m)
  if (distance < 500) return 2.5;  // Short sessions - faster pace
  if (distance < 1500) return 2.8; // Medium sessions
  return 3.0; // Long sessions - easier pace
};

/**
 * Generate session title
 */
const generateSessionTitle = (sessionType, isRecoveryWeek) => {
  if (isRecoveryWeek) {
    return 'Easy Recovery Swim';
  }

  const titles = {
    endurance: 'Endurance Builder',
    technique: 'Technique & Drills',
    mixed: 'Intervals & Pace Work'
  };

  return titles[sessionType] || 'Training Session';
};
