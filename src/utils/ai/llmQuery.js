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
