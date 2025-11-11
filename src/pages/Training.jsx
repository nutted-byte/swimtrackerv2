import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { PageContainer, PageHeader } from '../components/layout';
import { PlanCreationWizard } from '../components/PlanCreationWizard';
import { useTrainingPlan } from '../context/TrainingPlanContext';
import { useSwimData } from '../context/SwimDataContext';
import { querySwimData, getExampleQueries, suggestDateRangeForQuery } from '../utils/ai/llmQuery';
import { formatDuration } from '../utils/formatters';
import {
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Flame,
  ChevronDown,
  ChevronUp,
  Settings,
  Plus,
  AlertCircle,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Zap
} from 'lucide-react';

// Helper function to format distance with length count
const formatDistanceWithLengths = (distanceMeters, poolLength = 25) => {
  if (!distanceMeters || isNaN(distanceMeters)) {
    return '0.0km (0 lengths)';
  }
  const lengths = Math.round(distanceMeters / poolLength);
  const km = (distanceMeters / 1000).toFixed(1);
  return `${km}km (${lengths} lengths)`;
};

export const Training = () => {
  const { trainingPlan, thisWeekWorkouts, upcomingWorkouts, loading, completeWorkout, uncompleteWorkout, createPlan, deletePlan } = useTrainingPlan();
  const { sessions } = useSwimData();
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [showNewPlanConfirm, setShowNewPlanConfirm] = useState(false);

  // Swim Coach state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const exampleQueries = getExampleQueries();

  // Initialize all workouts as expanded and current week open when plan loads
  useEffect(() => {
    if (trainingPlan?.weeks) {
      const allWorkoutIds = {};
      trainingPlan.weeks.forEach(week => {
        week.sessions.forEach(session => {
          allWorkoutIds[session.id] = true;
        });
      });
      setExpandedWorkouts(allWorkoutIds);

      // Set current week as expanded
      if (trainingPlan?.progress?.current_week) {
        setExpandedWeeks({ [trainingPlan.progress.current_week]: true });
      }
    }
  }, [trainingPlan?.id]); // Only re-run when plan changes

  const toggleWeek = (weekNumber) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  const toggleWorkoutDetail = (workoutId) => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  const handleStartNewPlan = async () => {
    try {
      await deletePlan();
      setShowNewPlanConfirm(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  // Calculate cumulative token usage for coach
  const tokenStats = useMemo(() => {
    let totalInput = 0;
    let totalOutput = 0;
    let cachedCount = 0;

    messages.forEach(msg => {
      if (msg.usage) {
        totalInput += msg.usage.inputTokens || 0;
        totalOutput += msg.usage.outputTokens || 0;
      }
      if (msg.cached) {
        cachedCount++;
      }
    });

    return {
      totalInput,
      totalOutput,
      total: totalInput + totalOutput,
      cachedCount,
      queryCount: messages.filter(m => m.role === 'assistant').length,
    };
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCoachSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || coachLoading) return;

    const question = input.trim();
    setInput('');
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Show loading
    setCoachLoading(true);

    try {
      // Detect appropriate date range for query
      const maxDays = suggestDateRangeForQuery(question);

      // Query the LLM
      const response = await querySwimData(question, sessions, {
        maxDays,
        includeRecent: true,
        recentCount: 5,
        includeGrouped: true,
      });

      // Add assistant message
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        success: response.success,
        usage: response.usage,
        cached: response.cached || false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (!response.success) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Query error:', err);
      setError(err.message);

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        success: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleExampleClick = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Training Plan" />
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageContainer>
    );
  }

  // No active plan - show wizard inline
  if (!trainingPlan) {
    return (
      <PageContainer>
        <PageHeader title="Training Plan" />

        <PlanCreationWizard
          onComplete={async (formData) => {
            await createPlan(formData);
          }}
        />
      </PageContainer>
    );
  }

  const { goal, progress, weeks, status, availability } = trainingPlan;
  const currentWeek = weeks.find(w => w.weekNumber === progress.current_week);
  const poolLength = availability?.pool_length || 25;

  return (
    <PageContainer>
      <PageHeader
        title="Training Plan"
        actions={
          <button
            onClick={() => setShowNewPlanConfirm(true)}
            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 rounded-lg transition-colors text-sm font-medium flex items-center gap-3"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Plan</span>
          </button>
        }
      />

      {/* Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-accent-blue/20">
                <Target className="w-8 h-8 text-accent-blue" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold mb-1">{goal.description}</h2>
                <p className="text-content-secondary">
                  {goal.type === 'distance' && `${goal.current}m → ${goal.target}m`}
                  {goal.type === 'pace' && `${goal.current} → ${goal.target} min/100m`}
                </p>
              </div>
            </div>

            {status === 'active' && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-blue/20 text-accent-blue">
                Active
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Week {progress.current_week} of {weeks.length}</span>
              <span className="text-sm font-bold text-accent-blue">{progress.percent_complete}%</span>
            </div>
            <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent_complete}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent-blue to-primary-500 rounded-full"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-dark-bg/50 rounded-lg p-4">
              <div className="flex items-center gap-3 text-content-secondary text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
              <div className="font-display text-2xl font-bold">
                {progress.completed_workouts}/{progress.total_workouts}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* This Week's Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-display text-xl font-bold mb-4">This Week's Workouts</h3>

        {/* AI Coaching Tip */}
        {currentWeek?.coachingTip && (
          <Card className="mb-4 bg-accent-blue/10 border-accent-blue/30">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-blue/20 flex-shrink-0">
                <Target className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <div className="font-semibold text-sm text-accent-blue mb-1">This Week's Focus</div>
                <p className="text-sm text-content-secondary">{currentWeek.coachingTip}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {thisWeekWorkouts.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              weekNumber={progress.current_week}
              isExpanded={expandedWorkouts[workout.id]}
              onToggle={() => toggleWorkoutDetail(workout.id)}
              onComplete={completeWorkout}
              onUncomplete={uncompleteWorkout}
              poolLength={poolLength}
              delay={index * 0.05}
            />
          ))}
        </div>
      </motion.div>

      {/* Full Calendar - Collapsible Weeks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-display text-xl font-bold mb-4">Full {weeks.length}-Week Plan</h3>

        <div className="space-y-4">
          {weeks.map((week) => (
            <Card key={week.weekNumber} className="overflow-hidden">
              <button
                onClick={() => toggleWeek(week.weekNumber)}
                className="w-full flex items-center justify-between p-4 hover:bg-dark-bg/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                    week.weekNumber === progress.current_week
                      ? 'bg-accent-blue text-white'
                      : 'bg-dark-bg text-content-tertiary'
                  }`}>
                    W{week.weekNumber}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{week.focus}</div>
                    <div className="text-sm text-content-secondary">
                      {week.sessions.length} workouts • {(week.totalDistance / 1000).toFixed(1)}km total
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-content-tertiary">
                    {week.sessions.filter(s => s.completed).length}/{week.sessions.length} complete
                  </span>
                  {expandedWeeks[week.weekNumber] ? (
                    <ChevronUp className="w-5 h-5 text-content-tertiary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-content-tertiary" />
                  )}
                </div>
              </button>

              {expandedWeeks[week.weekNumber] && (
                <div className="border-t border-dark-border p-4 space-y-2">
                  {week.sessions.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      weekNumber={week.weekNumber}
                      isExpanded={expandedWorkouts[workout.id]}
                      onToggle={() => toggleWorkoutDetail(workout.id)}
                      onComplete={completeWorkout}
                      onUncomplete={uncompleteWorkout}
                      poolLength={poolLength}
                      compact
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </motion.div>

      {/* AI Swim Coach Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold">AI Swim Coach</h3>
          {tokenStats.queryCount > 0 && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-dark-card rounded-lg text-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-content-tertiary">
                {tokenStats.total.toLocaleString()} tokens
              </span>
              {tokenStats.cachedCount > 0 && (
                <span className="text-green-400 text-xs">
                  ({tokenStats.cachedCount} cached)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Welcome message / Example queries */}
        {messages.length === 0 && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Ask me anything about your swimming!
                  </h3>
                  <p className="text-content-tertiary mb-4">
                    I can analyze your {sessions.length} swim sessions and help you understand your progress, find patterns, and identify your best performances.
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm text-content-tertiary font-medium">Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exampleQueries.slice(0, 6).map(example => (
                        <button
                          key={example.id}
                          onClick={() => handleExampleClick(example.question)}
                          className="text-left px-4 py-3 bg-dark-card/50 hover:bg-dark-card rounded-lg text-sm transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <MessageCircle className="w-4 h-4 text-primary-400 flex-shrink-0" />
                            <span className="text-content-secondary group-hover:text-white transition-colors">
                              "{example.question}"
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Messages */}
        <div className="space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={message.role === 'user' ? 'bg-primary-500/10 border-primary-500/20' : ''}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary-500/20'
                        : 'bg-accent-blue/20'
                    }`}>
                      {message.role === 'user' ? (
                        <MessageCircle className="w-5 h-5 text-primary-400" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-accent-blue" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-sm">
                          {message.role === 'user' ? 'You' : 'AI Coach'}
                        </span>
                        <span className="text-xs text-content-tertiary">
                          {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-content-secondary whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      {message.usage && (
                        <div className="mt-2 flex items-center gap-3 text-xs text-content-tertiary">
                          <span>
                            {message.usage.inputTokens + message.usage.outputTokens} tokens
                          </span>
                          {message.cached && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                              Cached
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {coachLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-accent-blue animate-spin" />
                  </div>
                  <div className="text-content-tertiary">Analyzing your swim data...</div>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">Error</p>
                <p className="text-sm text-content-tertiary">{error}</p>
                {error.includes('API key') && (
                  <p className="text-xs text-content-tertiary mt-2">
                    Add your Anthropic API key to .env file: VITE_ANTHROPIC_API_KEY=your-key-here
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input form */}
        {sessions.length > 0 && (
          <Card className="bg-dark-card">
            <form onSubmit={handleCoachSubmit} className="flex gap-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your swimming..."
                disabled={coachLoading}
                className="flex-1 bg-dark-bg rounded-lg px-4 py-3 text-content placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || coachLoading}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-bg disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-3"
              >
                {coachLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        )}
      </motion.div>

      {/* Confirmation Modal for New Plan */}
      {showNewPlanConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 rounded-full bg-orange-500/20">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold mb-2">Start New Plan?</h3>
                  <p className="text-sm text-content-secondary">
                    This will archive your current training plan and all progress. You'll be able to create a completely new plan from scratch.
                  </p>
                </div>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4 mb-6">
                <div className="text-sm text-content-secondary">
                  <strong className="text-content">Current Plan:</strong>
                  <div className="mt-1">{goal.description}</div>
                  <div className="mt-1 text-xs">
                    {progress.completed_workouts}/{progress.total_workouts} workouts completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNewPlanConfirm(false)}
                  className="flex-1 px-4 py-2 bg-dark-bg hover:bg-dark-bg/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNewPlan}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors font-medium"
                >
                  Start New Plan
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
};

// Workout Card Component
const WorkoutCard = ({ workout, weekNumber, isExpanded, onToggle, onComplete, onUncomplete, poolLength = 25, compact = false, delay = 0 }) => {
  const handleComplete = async () => {
    try {
      await onComplete(workout.id, {
        distance: workout.totalDistance,
        duration: workout.estimatedTime,
        pace: workout.targetPace || 0
      });
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const handleUncomplete = async () => {
    try {
      await onUncomplete(workout.id);
    } catch (error) {
      console.error('Error uncompleting workout:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`bg-dark-card rounded-lg border ${
        workout.completed
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-dark-border hover:border-primary-500/30'
      } transition-all`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          {workout.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-content-tertiary flex-shrink-0" />
          )}

          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">{workout.title}</div>
            {!compact && (
              <div className="flex items-center gap-4 text-xs text-content-tertiary">
                <span className="capitalize">{workout.day}</span>
                <span>•</span>
                <span>{formatDistanceWithLengths(workout.totalDistance, poolLength)}</span>
                <span>•</span>
                <span>~{workout.estimatedTime} min</span>
              </div>
            )}
          </div>
        </div>

        {!workout.completed ? (
          !compact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              className="px-3 py-1.5 bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue rounded text-xs font-medium transition-colors mr-2"
            >
              Mark complete
            </button>
          )
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUncomplete();
            }}
            className="px-3 py-1.5 bg-dark-bg hover:bg-dark-bg/80 text-content-secondary rounded text-xs font-medium transition-colors mr-2"
          >
            Mark uncomplete
          </button>
        )}

        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-content-tertiary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-content-tertiary flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-dark-border p-4 space-y-4">
          {/* Description */}
          {workout.description && (
            <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-4">
              <p className="text-sm text-content">
                {workout.description}
              </p>
            </div>
          )}

          {/* Warmup */}
          {workout.warmup && workout.warmup.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-accent-blue mb-2">Warm-up</h4>
              <ul className="space-y-2 text-sm text-content-secondary">
                {workout.warmup.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-content-tertiary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Set */}
          {workout.mainSet && workout.mainSet.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary-400 mb-2">Main Set</h4>
              <ul className="space-y-2 text-sm text-content-secondary">
                {workout.mainSet.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-content-tertiary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cooldown */}
          {workout.cooldown && workout.cooldown.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">Cool-down</h4>
              <ul className="space-y-2 text-sm text-content-secondary">
                {workout.cooldown.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-content-tertiary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Workout Stats */}
          <div className="pt-3 border-t border-dark-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-content-tertiary">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{formatDistanceWithLengths(workout.totalDistance, poolLength)} total</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>~{workout.estimatedTime} minutes</span>
              </div>
            </div>

            {!workout.completed && (
              <button
                onClick={handleComplete}
                className="px-3 py-1.5 bg-accent-blue hover:bg-accent-blue/90 text-white rounded text-xs font-medium transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                Complete
              </button>
            )}
          </div>

          {/* Actual Performance (if completed) */}
          {workout.completed && workout.actualPerformance && (
            <div className="pt-3 border-t border-dark-border">
              <h4 className="text-xs font-semibold text-green-400 mb-2">Your Performance</h4>
              <div className="flex items-center gap-4 text-xs text-content-secondary">
                <span>{(workout.actualPerformance.distance / 1000).toFixed(1)}km</span>
                <span>•</span>
                <span>{formatDuration(workout.actualPerformance.duration)}</span>
                <span>•</span>
                <span>{workout.actualPerformance.pace.toFixed(2)} min/100m pace</span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
