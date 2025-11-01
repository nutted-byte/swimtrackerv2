/**
 * LLM Query utilities for natural language swim data analysis
 * Uses Claude API to answer questions about swim sessions
 * Includes caching to reduce token usage and API calls
 */

import { prepareSwimContext, filterSessionsByDays } from '../cache/dataCompression.js';
import { API_CONFIG } from '../constants.js';
import { getCachedResponse, cacheResponse } from '../cache/queryCache.js';

/**
 * Query swim data using natural language
 * @param {string} question - User's question
 * @param {Array} sessions - Array of swim sessions
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Response with answer and metadata
 */
export const querySwimData = async (question, sessions, options = {}) => {
  const {
    includeRecent = true,
    recentCount = 5, // Reduced from 10 to save tokens
    includeGrouped = true,
    maxDays = null,
  } = options;

  // Filter sessions by date range if specified
  const sessionsToQuery = maxDays
    ? filterSessionsByDays(sessions, maxDays)
    : sessions;

  // Check cache first to avoid redundant API calls
  const cachedResponse = getCachedResponse(question, sessionsToQuery, options);
  if (cachedResponse) {
    return {
      ...cachedResponse,
      cached: true, // Flag to indicate this came from cache
    };
  }

  // Prepare compressed context
  const context = prepareSwimContext(sessionsToQuery, {
    includeSummary: true,
    includeRecent,
    recentCount,
    includeGrouped,
    groupPeriod: 'month',
  });

  // Build optimized prompts - concise to minimize token usage
  const systemPrompt = `Swim coach analyzing performance data. Key metrics:
- Pace (min/100m): lower = faster
- SWOLF: lower = more efficient
- Distance in meters
Data format: JSON with summary, recent swims, grouped stats. Be concise and data-driven.`;

  const userPrompt = `Data: ${context}

Q: ${question}`;

  try {
    const response = await callClaudeAPI(systemPrompt, userPrompt);
    const result = {
      success: true,
      answer: response.content,
      model: response.model,
      usage: response.usage,
    };

    // Cache successful response
    cacheResponse(question, sessionsToQuery, options, result);

    return result;
  } catch (error) {
    console.error('LLM Query Error:', error);
    return {
      success: false,
      error: error.message,
      answer: 'Sorry, I encountered an error while analyzing your swim data. Please try again.',
    };
  }
};

/**
 * Call Claude API via Supabase Edge Function
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @returns {Promise<Object>} API response
 */
const callClaudeAPI = async (systemPrompt, userPrompt) => {
  // Import supabase client
  const { supabase } = await import('../../lib/supabase.js');

  // Get the current session for auth
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('You must be logged in to use the AI feature');
  }

  // Get the Supabase URL for edge functions
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/ask-ai`;

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      systemPrompt,
      userPrompt,
      model: API_CONFIG.CLAUDE_MODEL,
      maxTokens: API_CONFIG.MAX_TOKENS,
      temperature: API_CONFIG.TEMPERATURE,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  const data = await response.json();

  return {
    content: data.content,
    model: data.model,
    usage: {
      inputTokens: data.usage.inputTokens,
      outputTokens: data.usage.outputTokens,
    },
  };
};

/**
 * Get example queries to help users get started
 * @returns {Array} Array of example query objects
 */
export const getExampleQueries = () => {
  return [
    {
      id: 'recent-progress',
      category: 'Progress',
      question: 'Am I getting better over the last 3 months?',
      description: 'Compare your recent performance to past performance',
    },
    {
      id: 'fastest-swims',
      category: 'Records',
      question: 'What are my 5 fastest swims?',
      description: 'Find your best pace performances',
    },
    {
      id: 'consistency',
      category: 'Patterns',
      question: 'How consistent is my pace?',
      description: 'Analyze pace variability over time',
    },
    {
      id: 'monthly-comparison',
      category: 'Comparison',
      question: 'Compare my performance this month vs last month',
      description: 'Month-over-month analysis',
    },
    {
      id: 'efficiency',
      category: 'Efficiency',
      question: 'How has my SWOLF improved over time?',
      description: 'Track efficiency improvements',
    },
    {
      id: 'distance-trends',
      category: 'Volume',
      question: 'Am I swimming longer distances?',
      description: 'Analyze distance progression',
    },
    {
      id: 'best-period',
      category: 'Patterns',
      question: 'When was my best swimming period?',
      description: 'Identify peak performance timeframe',
    },
    {
      id: 'rating-correlation',
      category: 'Insights',
      question: 'Is there a correlation between how I feel and my pace?',
      description: 'Analyze ratings vs performance',
    },
    {
      id: 'specific-distance',
      category: 'Records',
      question: 'What is my best pace for swims around 1000m?',
      description: 'Filter by distance range',
    },
    {
      id: 'technique-swolf',
      category: 'Technique',
      question: 'How do I improve my SWOLF?',
      description: 'Get technique tips for efficiency',
    },
    {
      id: 'technique-pacing',
      category: 'Technique',
      question: 'How can I pace myself better?',
      description: 'Learn pacing strategies',
    },
    {
      id: 'technique-general',
      category: 'Technique',
      question: 'What technique should I work on?',
      description: 'Personalized technique recommendations',
    },
    {
      id: 'recent-trends',
      category: 'Trends',
      question: 'What trends do you see in my last 10 swims?',
      description: 'Spot recent patterns',
    },
  ];
};

/**
 * Detect intent and suggest date range for query
 * @param {string} question - User's question
 * @returns {number|null} Suggested days to include, or null for all data
 */
export const suggestDateRangeForQuery = (question) => {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('last week') || lowerQuestion.includes('this week')) {
    return 7;
  }
  if (lowerQuestion.includes('last month') || lowerQuestion.includes('this month')) {
    return 30;
  }
  if (lowerQuestion.includes('last 3 months') || lowerQuestion.includes('quarter')) {
    return 90;
  }
  if (lowerQuestion.includes('last 6 months') || lowerQuestion.includes('half year')) {
    return 180;
  }
  if (lowerQuestion.includes('this year') || lowerQuestion.includes('last year')) {
    return 365;
  }

  // Keywords that suggest recent data
  const recentKeywords = ['recent', 'lately', 'currently', 'now'];
  if (recentKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 30;
  }

  // Keywords that suggest all-time data
  const allTimeKeywords = ['all time', 'ever', 'best', 'fastest', 'slowest', 'longest'];
  if (allTimeKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return null;
  }

  // Default: last 30 days for most queries (saves tokens)
  return 30;
};

/**
 * Analyze a specific swim with AI
 * Generates 3-4 key insights about the swim's performance
 * @param {Object} swim - The swim to analyze
 * @param {Array} recentSwims - Recent swims for comparison (last 3-5)
 * @returns {Promise<Object>} Analysis with insights
 */
export const analyzeSwim = async (swim, recentSwims) => {
  // Helper to format pace as min:sec
  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Prepare minimal context for this swim
  const swimData = {
    date: swim.date,
    distance: swim.distance,
    duration: swim.duration,
    pace: formatPace(swim.pace),
    swolf: swim.swolf || null,
    rating: swim.rating,
  };

  // Include comparison data (last 3 swims, excluding current)
  const comparisons = recentSwims
    .filter(s => s.id !== swim.id)
    .slice(0, 3)
    .map(s => ({
      date: s.date,
      dist: s.distance,
      pace: formatPace(s.pace),
      swolf: s.swolf || null,
    }));

  const context = JSON.stringify({
    swim: swimData,
    recent: comparisons,
  });

  // Optimized prompt for swim analysis
  const systemPrompt = `You are a swim coach. Analyze this swim and provide 3-4 concise insights (max 100 words total).

DATA FORMAT: Pace is in min:sec format per 100m (e.g., 2:39 min/100m). Lower pace = faster swimming.

IMPORTANT: Start your first point by explicitly stating "Compared to your last ${comparisons.length} swim${comparisons.length > 1 ? 's' : ''}..."

When mentioning pace, ALWAYS:
1. Include the unit "min/100m"
2. Provide both "from" and "to" values for comparison
Example: "Your pace improved from 3:07 min/100m to 2:51 min/100m"

Focus on:
1. Performance vs recent swims (state the comparison count with specific values)
2. Notable strengths
3. One specific improvement area
Format as bullet points.`;

  const userPrompt = `Data: ${context}

Analyze this swim.`;

  try {
    const response = await callClaudeAPI(systemPrompt, userPrompt);
    return {
      success: true,
      content: response.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Swim Analysis Error:', error);
    return {
      success: false,
      error: error.message,
      content: 'Unable to analyze this swim. Please try again.',
    };
  }
};

/**
 * Ask a follow-up question about a specific swim
 * @param {string} question - User's question
 * @param {Object} swim - The swim being asked about
 * @param {string} previousAnalysis - The initial analysis content
 * @param {Array} previousQA - Previous Q&A pairs (last 2 only)
 * @returns {Promise<Object>} Answer with metadata
 */
export const askAboutSwim = async (question, swim, previousAnalysis, previousQA = []) => {
  // Build minimal context
  const swimData = {
    date: swim.date,
    distance: swim.distance,
    pace: swim.pace?.toFixed(2),
    swolf: swim.swolf || null,
  };

  const context = {
    swim: swimData,
    analysis: previousAnalysis,
  };

  // Include last 2 Q&A pairs for context (token optimization)
  if (previousQA.length > 0) {
    context.previous = previousQA.slice(-2).map(qa => ({
      q: qa.question,
      a: qa.answer,
    }));
  }

  const systemPrompt = `Swim coach answering follow-up questions about a specific swim. Be concise (max 80 words).`;

  const userPrompt = `Context: ${JSON.stringify(context)}

Q: ${question}`;

  try {
    const response = await callClaudeAPI(systemPrompt, userPrompt);
    return {
      success: true,
      answer: response.content,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Swim Q&A Error:', error);
    return {
      success: false,
      error: error.message,
      answer: 'Unable to answer this question. Please try again.',
    };
  }
};

/**
 * Generate complete AI-powered training plan
 * AI creates the entire 8-week structure with workout details
 * @param {Object} planParams - Plan parameters from wizard
 * @returns {Promise<Object>} Complete training plan structure
 */
export const generateFullTrainingPlan = async (planParams) => {
  const {
    goalType,
    currentValue,
    targetValue,
    timeline = 8,
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25
  } = planParams;

  // Build detailed context for AI
  const context = {
    goal: {
      type: goalType,
      description: goalType === 'distance'
        ? `Build to ${targetValue}m continuous swim`
        : goalType === 'pace'
        ? `Improve pace to ${targetValue} min/100m`
        : 'General fitness improvement',
      current: `${currentValue}${goalType === 'distance' ? 'm' : ' min/100m'}`,
      target: `${targetValue}${goalType === 'distance' ? 'm' : ' min/100m'}`
    },
    swimmer: {
      level: experienceLevel,
      availability: `${daysPerWeek}x per week`,
      sessionDuration: `${minutesPerSession} minutes per session`,
      poolLength: `${poolLength}m pool`,
      timeline: `${timeline} weeks`
    }
  };

  const systemPrompt = `You are an expert swim coach. You MUST respond with ONLY valid JSON, no other text.

CRITICAL UNDERSTANDING:
- All distances are in METERS (not km)
- For "distance" goals: current/target refer to SINGLE SESSION continuous swim distance
  Example: "Build from 800m to 1500m" means Week 1 might have 900m sessions, Week 8 has 1500m sessions
- For "pace" goals: current/target refer to pace per 100m
- Respect time constraints: ${minutesPerSession}min sessions at ~2.5 min/100m pace
- Pool length is ${poolLength}m - ALL distances MUST be multiples of ${poolLength}m (e.g., ${poolLength}m, ${poolLength * 2}m, ${poolLength * 4}m, ${poolLength * 8}m, ${poolLength * 10}m, etc.)

TRAINING PRINCIPLES:
- Progressive overload: gradual increases week-over-week
- Recovery weeks: ${timeline >= 6 ? `Mid-point (Week ${Math.floor(timeline / 2)})` : 'Not applicable for short plans'}${timeline >= 8 ? ` and near end (Week ${timeline - 1})` : ''} at ~70% volume
- Variety: Mix endurance (long steady), technique (drills), and intervals
- Beginner: smaller jumps, more technique work, longer rest
- Advanced: bigger jumps, more intensity, race-specific work

REQUIRED JSON STRUCTURE:
{
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Building Base Endurance",
      "coachingTip": "Focus on smooth technique over speed",
      "sessions": [
        {
          "day": "monday",
          "title": "Endurance Builder",
          "description": "This session builds aerobic capacity with steady-state swimming at a sustainable pace. The 200m intervals allow you to focus on maintaining consistent technique while building stamina. Short rest periods train your body to recover quickly between efforts.",
          "warmup": ["200m easy swim", "4x50m kick with 20s rest"],
          "mainSet": ["4x200m @ steady pace", "Rest 30s between each", "Focus on breathing rhythm"],
          "cooldown": ["200m easy swim"],
          "totalDistance": 1200,
          "estimatedTime": 35,
          "targetPace": 2.8
        }
      ]
    }
  ],
  "overview": "Your personalized 8-week plan builds progressively toward your goal."
}

REQUIREMENTS:
- Generate ALL ${timeline} weeks
- For ${daysPerWeek} sessions per week, vary days (Monday, Wednesday, Friday for 3x, etc.)
- Session distances should be realistic and fit in ${minutesPerSession} minutes
- Main sets should have specific instructions (not just distance)
- Progressive: each week should logically build on previous
- CRITICAL: Every session MUST include "totalDistance" (in meters) - sum of warmup + mainSet + cooldown
- IMPORTANT: Every session MUST include a "description" field (2-3 sentences) explaining:
  * The primary purpose of the workout (e.g., building aerobic capacity, improving speed, recovery)
  * Key training concepts or physiological benefits
  * How the structure supports the goal (e.g., why these intervals, rest periods, or distances)

CRITICAL: Return ONLY the JSON object. No explanations, no markdown, no other text.`;

  const userPrompt = `Create a ${timeline}-week swimming training plan for:
${JSON.stringify(context, null, 2)}

Return ONLY valid JSON matching the required structure. Do not include any text before or after the JSON.`;

  let response;
  try {
    response = await callClaudeAPI(systemPrompt, userPrompt);

    // Parse JSON response with better error handling
    let content = response.content.trim();

    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to extract JSON if Claude added any text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    // Log for debugging
    console.log('Attempting to parse AI response, first 200 chars:', content.substring(0, 200));

    const planStructure = JSON.parse(content);

    // Validate structure
    if (!planStructure.weeks || planStructure.weeks.length !== timeline) {
      throw new Error(`AI generated invalid plan structure: expected ${timeline} weeks, got ${planStructure.weeks?.length || 0}`);
    }

    // Ensure totalDistance is set for all sessions
    planStructure.weeks.forEach(week => {
      week.sessions.forEach(session => {
        if (!session.totalDistance || isNaN(session.totalDistance)) {
          console.warn(`Session "${session.title}" missing totalDistance, attempting to calculate...`);

          // Try to calculate from warmup/mainSet/cooldown
          let calculatedDistance = 0;

          const extractDistance = (item) => {
            if (!item) return 0;
            // Match patterns like "200m", "4x50m", "8x100m"
            const match = item.match(/(\d+)x(\d+)m|(\d+)m/);
            if (match) {
              if (match[1] && match[2]) {
                // Pattern: 4x50m
                return parseInt(match[1]) * parseInt(match[2]);
              } else if (match[3]) {
                // Pattern: 200m
                return parseInt(match[3]);
              }
            }
            return 0;
          };

          // Sum up all parts
          if (session.warmup) {
            session.warmup.forEach(item => {
              calculatedDistance += extractDistance(item);
            });
          }
          if (session.mainSet) {
            session.mainSet.forEach(item => {
              calculatedDistance += extractDistance(item);
            });
          }
          if (session.cooldown) {
            session.cooldown.forEach(item => {
              calculatedDistance += extractDistance(item);
            });
          }

          session.totalDistance = calculatedDistance;
          console.log(`Calculated totalDistance for "${session.title}": ${calculatedDistance}m`);
        }
      });
    });

    console.log('✅ Successfully generated AI training plan');
    return {
      success: true,
      planStructure,
      usage: response.usage
    };
  } catch (error) {
    console.error('AI Plan Generation Error:', error);
    if (response?.content) {
      console.error('Raw response content:', response.content.substring(0, 500));
    }
    return {
      success: false,
      error: error.message,
      planStructure: null
    };
  }
};

/**
 * Generate AI-enhanced training plan insights
 * Adds personalized coaching tips and weekly focus descriptions
 * @param {Object} planParams - Plan parameters from wizard
 * @returns {Promise<Object>} AI-generated enhancements
 */
export const generatePlanEnhancements = async (planParams) => {
  const {
    goalType,
    currentValue,
    targetValue,
    experienceLevel,
    daysPerWeek,
    minutesPerSession
  } = planParams;

  // Build concise context for AI
  const context = {
    goal: goalType,
    current: currentValue,
    target: targetValue,
    level: experienceLevel,
    frequency: `${daysPerWeek}x/week`,
    sessionLength: `${minutesPerSession}min`
  };

  const systemPrompt = `You are an experienced swim coach creating personalized training plans. Provide concise, motivating guidance.

Generate:
1. Weekly focus themes (8 weeks): Short phrases (3-5 words) for each week's training emphasis
2. Coaching tips (8 weeks): One specific, actionable tip per week (max 20 words)
3. Plan overview: Brief motivational message (max 40 words)

Output as JSON:
{
  "weeklyFocus": ["Week 1 focus", "Week 2 focus", ...],
  "coachingTips": ["Week 1 tip", "Week 2 tip", ...],
  "overview": "Plan overview message"
}`;

  const userPrompt = `Swimmer profile: ${JSON.stringify(context)}

Create personalized weekly focuses and coaching tips for this 8-week plan. Make it specific to their goal and experience level.`;

  try {
    const response = await callClaudeAPI(systemPrompt, userPrompt);

    // Parse JSON response
    const content = response.content.trim();
    // Remove markdown code blocks if present
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const enhancements = JSON.parse(jsonStr);

    return {
      success: true,
      enhancements,
      usage: response.usage
    };
  } catch (error) {
    console.error('Plan Enhancement Error:', error);

    // Fallback to generic enhancements if AI fails
    return {
      success: false,
      error: error.message,
      enhancements: {
        weeklyFocus: [
          'Building Base',
          'Aerobic Development',
          'Volume Increase',
          'Recovery Week',
          'Speed Endurance',
          'Threshold Work',
          'Recovery & Refine',
          'Peak & Taper'
        ],
        coachingTips: [
          'Focus on technique over speed this week',
          'Build aerobic capacity with steady pacing',
          'Embrace the increased volume gradually',
          'Use recovery week to perfect your form',
          'Add controlled speed to build power',
          'Push your threshold with focused intervals',
          'Sharpen technique during recovery',
          'Taper smart - trust your training'
        ],
        overview: 'Your personalized 8-week plan progressively builds toward your goal.'
      }
    };
  }
};
