import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { CardVariant, IconContainer, Separator } from '../components/primitives';
import { Button } from '../components/Button';
import { PageContainer, PageHeader } from '../components/layout';
import { PlanCreationWizard } from '../components/PlanCreationWizard';
import { useTrainingPlan } from '../context/TrainingPlanContext';
import { useSwimData } from '../context/SwimDataContext';
import { querySwimData, getExampleQueries, suggestDateRangeForQuery } from '../utils/ai/llmQuery';
import { formatDuration } from '../utils/formatters';
import { tokens } from '../design/tokens';
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
        <div className={`flex items-center justify-center ${tokens.padding.hero}`}>
          <div className={`${tokens.components.iconContainer.lg} border-4 border-primary-500 border-t-transparent ${tokens.radius.full} animate-spin`}></div>
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewPlanConfirm(true)}
            leftIcon={<Plus />}
          >
            <span className="hidden sm:inline">New Plan</span>
          </Button>
        }
      />

      {/* Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 ${tokens.margin.section}`}>
          <div className={`flex items-start justify-between ${tokens.margin.section}`}>
            <div className={`flex items-center ${tokens.gap.default}`}>
              <div className={`${tokens.padding.default} ${tokens.radius.md} bg-accent-blue/20`}>
                <Target className={`${tokens.icons.lg} text-accent-blue`} />
              </div>
              <div>
                <h2 className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} ${tokens.margin.element}`}>{goal.description}</h2>
                <p className="text-content-secondary">
                  {goal.type === 'distance' && `${goal.current}m → ${goal.target}m`}
                  {goal.type === 'pace' && `${goal.current} → ${goal.target} min/100m`}
                </p>
              </div>
            </div>

            {status === 'active' && (
              <span className={`px-3 py-1 ${tokens.radius.full} ${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} bg-accent-blue/20 text-accent-blue`}>
                Active
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className={tokens.margin.section}>
            <div className={`flex items-center justify-between ${tokens.margin.element}`}>
              <span className={`${tokens.typography.sizes.sm} font-medium`}>Week {progress.current_week} of {weeks.length}</span>
              <span className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.bold} text-accent-blue`}>{progress.percent_complete}%</span>
            </div>
            <div className={`w-full h-3 bg-dark-bg ${tokens.radius.full} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent_complete}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r from-accent-blue to-primary-500 ${tokens.radius.full}`}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-1 ${tokens.gap.default}`}>
            <div className={`bg-dark-bg/50 ${tokens.radius.md} ${tokens.padding.default}`}>
              <div className={`flex items-center ${tokens.gap.tight} text-content-secondary ${tokens.typography.sizes.sm} ${tokens.margin.element}`}>
                <CheckCircle2 className={tokens.icons.sm} />
                Completed
              </div>
              <div className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
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
        className={tokens.margin.section}
      >
        <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} ${tokens.margin.group}`}>This Week's Workouts</h3>

        {/* AI Coaching Tip */}
        {currentWeek?.coachingTip && (
          <Card className={`${tokens.margin.group} bg-accent-blue/10 border-accent-blue/30`}>
            <div className={`flex items-start ${tokens.gap.default}`}>
              <div className={`${tokens.padding.tight} ${tokens.radius.md} bg-accent-blue/20 flex-shrink-0`}>
                <Target className={`${tokens.icons.md} text-accent-blue`} />
              </div>
              <div>
                <div className={`${tokens.typography.weights.semibold} ${tokens.typography.sizes.sm} text-accent-blue ${tokens.margin.element}`}>This Week's Focus</div>
                <p className={`${tokens.typography.sizes.sm} text-content-secondary`}>{currentWeek.coachingTip}</p>
              </div>
            </div>
          </Card>
        )}

        <div className={tokens.gap.default}>
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
        <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} ${tokens.margin.group}`}>Full {weeks.length}-Week Plan</h3>

        <div className={tokens.gap.default}>
          {weeks.map((week) => (
            <Card key={week.weekNumber} className="overflow-hidden">
              <button
                onClick={() => toggleWeek(week.weekNumber)}
                className={`w-full flex items-center justify-between ${tokens.padding.default} hover:bg-dark-bg/30 transition-colors`}
              >
                <div className={`flex items-center ${tokens.gap.default}`}>
                  <div className={`${tokens.components.iconContainer.lg} ${tokens.radius.md} flex items-center justify-center ${tokens.typography.weights.bold} ${
                    week.weekNumber === progress.current_week
                      ? 'bg-accent-blue text-white'
                      : 'bg-dark-bg text-content-tertiary'
                  }`}>
                    W{week.weekNumber}
                  </div>
                  <div className="text-left">
                    <div className={tokens.typography.weights.semibold}>{week.focus}</div>
                    <div className={`${tokens.typography.sizes.sm} text-content-secondary`}>
                      {week.sessions.length} workouts • {(week.totalDistance / 1000).toFixed(1)}km total
                    </div>
                  </div>
                </div>

                <div className={`flex items-center ${tokens.gap.default}`}>
                  <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                    {week.sessions.filter(s => s.completed).length}/{week.sessions.length} complete
                  </span>
                  {expandedWeeks[week.weekNumber] ? (
                    <ChevronUp className={`${tokens.icons.md} text-content-tertiary`} />
                  ) : (
                    <ChevronDown className={`${tokens.icons.md} text-content-tertiary`} />
                  )}
                </div>
              </button>

              {expandedWeeks[week.weekNumber] && (
                <>
                  <Separator spacing="none" />
                  <div className={`${tokens.padding.default} space-y-2`}>
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
                </>
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
        className={tokens.margin.hero}
      >
        <div className={`flex items-center justify-between ${tokens.margin.group}`}>
          <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold}`}>AI Swim Coach</h3>
          {tokenStats.queryCount > 0 && (
            <div className={`flex items-center ${tokens.gap.tight} px-3 py-1.5 bg-dark-card ${tokens.radius.md} ${tokens.typography.sizes.sm}`}>
              <Zap className={`${tokens.icons.sm} text-yellow-400`} />
              <span className="text-content-tertiary">
                {tokenStats.total.toLocaleString()} tokens
              </span>
              {tokenStats.cachedCount > 0 && (
                <span className={`text-green-400 ${tokens.typography.sizes.xs}`}>
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
            className={tokens.margin.section}
          >
            <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <div className={`flex items-start ${tokens.gap.default}`}>
                <div className={`${tokens.components.iconContainer.lg} ${tokens.radius.full} bg-primary-500/20 flex items-center justify-center flex-shrink-0`}>
                  <Sparkles className={`${tokens.icons.lg} text-primary-400`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.semibold} ${tokens.margin.element}`}>
                    Ask me anything about your swimming!
                  </h3>
                  <p className={`text-content-tertiary ${tokens.margin.group}`}>
                    I can analyze your {sessions.length} swim sessions and help you understand your progress, find patterns, and identify your best performances.
                  </p>

                  <div className="space-y-2">
                    <p className={`${tokens.typography.sizes.sm} text-content-tertiary font-medium`}>Try asking:</p>
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.gap.tight}`}>
                      {exampleQueries.slice(0, 6).map(example => (
                        <Button
                          key={example.id}
                          variant="secondary"
                          size="md"
                          onClick={() => handleExampleClick(example.question)}
                          className="text-left justify-start group"
                        >
                          <MessageCircle className={`${tokens.icons.sm} text-primary-400 flex-shrink-0`} />
                          <span className="text-content-secondary group-hover:text-white transition-colors">
                            "{example.question}"
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Messages */}
        <div className={`space-y-4 ${tokens.margin.group}`}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={message.role === 'user' ? 'bg-primary-500/10 border-primary-500/20' : ''}>
                  <div className={`flex items-start ${tokens.gap.default}`}>
                    <div className={`${tokens.components.iconContainer.md} ${tokens.radius.full} flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary-500/20'
                        : 'bg-accent-blue/20'
                    }`}>
                      {message.role === 'user' ? (
                        <MessageCircle className={`${tokens.icons.md} text-primary-400`} />
                      ) : (
                        <Sparkles className={`${tokens.icons.md} text-accent-blue`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center ${tokens.gap.tight} ${tokens.margin.element}`}>
                        <span className={`font-medium ${tokens.typography.sizes.sm}`}>
                          {message.role === 'user' ? 'You' : 'AI Coach'}
                        </span>
                        <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                          {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-content-secondary whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      {message.usage && (
                        <div className={`${tokens.margin.element} flex items-center ${tokens.gap.tight} ${tokens.typography.sizes.xs} text-content-tertiary`}>
                          <span>
                            {message.usage.inputTokens + message.usage.outputTokens} tokens
                          </span>
                          {message.cached && (
                            <span className={`px-2 py-0.5 bg-green-500/20 text-green-400 ${tokens.radius.sm}`}>
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
                <div className={`flex items-center ${tokens.gap.default}`}>
                  <div className={`${tokens.components.iconContainer.md} ${tokens.radius.full} bg-accent-blue/20 flex items-center justify-center`}>
                    <Loader2 className={`${tokens.icons.md} text-accent-blue animate-spin`} />
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
            className={tokens.margin.group}
          >
            <CardVariant variant="danger" className={`flex items-start ${tokens.gap.default}`}>
              <IconContainer icon={<AlertCircle />} variant="danger" size="md" className="mt-0.5" />
              <div>
                <p className={`text-red-400 font-medium ${tokens.margin.element}`}>Error</p>
                <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>{error}</p>
                {error.includes('API key') && (
                  <p className={`${tokens.typography.sizes.xs} text-content-tertiary ${tokens.margin.element}`}>
                    Add your Anthropic API key to .env file: VITE_ANTHROPIC_API_KEY=your-key-here
                  </p>
                )}
              </div>
            </CardVariant>
          </motion.div>
        )}

        {/* Input form */}
        {sessions.length > 0 && (
          <Card className="bg-dark-card">
            <form onSubmit={handleCoachSubmit} className={`flex ${tokens.gap.default}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your swimming..."
                disabled={coachLoading}
                className={`flex-1 bg-dark-bg ${tokens.radius.md} px-4 py-3 text-content placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!input.trim() || coachLoading}
                leftIcon={coachLoading ? <Loader2 className="animate-spin" /> : <Send />}
              >
                <span className="hidden sm:inline">{coachLoading ? 'Thinking...' : 'Send'}</span>
              </Button>
            </form>
          </Card>
        )}
      </motion.div>

      {/* Confirmation Modal for New Plan */}
      {showNewPlanConfirm && (
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center ${tokens.padding.default}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <div className={`flex items-start ${tokens.gap.default} ${tokens.margin.group}`}>
                <div className={`${tokens.padding.default} ${tokens.radius.full} bg-orange-500/20`}>
                  <AlertCircle className={`${tokens.icons.lg} text-orange-400`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} ${tokens.margin.element}`}>Start New Plan?</h3>
                  <p className={`${tokens.typography.sizes.sm} text-content-secondary`}>
                    This will archive your current training plan and all progress. You'll be able to create a completely new plan from scratch.
                  </p>
                </div>
              </div>

              <div className={`bg-dark-bg/50 ${tokens.radius.md} ${tokens.padding.default} ${tokens.margin.section}`}>
                <div className={`${tokens.typography.sizes.sm} text-content-secondary`}>
                  <strong className="text-content">Current Plan:</strong>
                  <div className={tokens.margin.element}>{goal.description}</div>
                  <div className={`${tokens.margin.element} ${tokens.typography.sizes.xs}`}>
                    {progress.completed_workouts}/{progress.total_workouts} workouts completed
                  </div>
                </div>
              </div>

              <div className={`flex items-center ${tokens.gap.default}`}>
                <Button
                  variant="secondary"
                  onClick={() => setShowNewPlanConfirm(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="warning"
                  onClick={handleStartNewPlan}
                  fullWidth
                >
                  Start New Plan
                </Button>
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
      className={`bg-dark-card ${tokens.radius.md} border ${
        workout.completed
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-dark-border hover:border-primary-500/30'
      } transition-all`}
    >
      <button
        onClick={onToggle}
        className={`w-full ${tokens.padding.default} flex items-center justify-between text-left`}
      >
        <div className={`flex items-center ${tokens.gap.default} flex-1`}>
          {workout.completed ? (
            <CheckCircle2 className={`${tokens.icons.md} text-green-400 flex-shrink-0`} />
          ) : (
            <Circle className={`${tokens.icons.md} text-content-tertiary flex-shrink-0`} />
          )}

          <div className="flex-1">
            <div className={`${tokens.typography.weights.semibold} ${tokens.typography.sizes.sm} ${tokens.margin.element}`}>{workout.title}</div>
            {!compact && (
              <div className={`flex items-center ${tokens.gap.default} ${tokens.typography.sizes.xs} text-content-tertiary`}>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              className="bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue mr-2"
            >
              Mark complete
            </Button>
          )
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleUncomplete();
            }}
            className="mr-2"
          >
            Mark uncomplete
          </Button>
        )}

        {isExpanded ? (
          <ChevronUp className={`${tokens.icons.sm} text-content-tertiary flex-shrink-0`} />
        ) : (
          <ChevronDown className={`${tokens.icons.sm} text-content-tertiary flex-shrink-0`} />
        )}
      </button>

      {isExpanded && (
        <>
          <Separator spacing="none" />
          <div className={`${tokens.padding.default} space-y-4`}>
            {/* Description */}
          {workout.description && (
            <div className={`bg-accent-blue/10 border border-accent-blue/20 ${tokens.radius.md} ${tokens.padding.default}`}>
              <p className={`${tokens.typography.sizes.sm} text-content`}>
                {workout.description}
              </p>
            </div>
          )}

          {/* Warmup */}
          {workout.warmup && workout.warmup.length > 0 && (
            <div>
              <h4 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-accent-blue ${tokens.margin.element}`}>Warm-up</h4>
              <ul className={`space-y-2 ${tokens.typography.sizes.sm} text-content-secondary`}>
                {workout.warmup.map((item, i) => (
                  <li key={i} className={`flex ${tokens.gap.tight}`}>
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
              <h4 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-primary-400 ${tokens.margin.element}`}>Main Set</h4>
              <ul className={`space-y-2 ${tokens.typography.sizes.sm} text-content-secondary`}>
                {workout.mainSet.map((item, i) => (
                  <li key={i} className={`flex ${tokens.gap.tight}`}>
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
              <h4 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-green-400 ${tokens.margin.element}`}>Cool-down</h4>
              <ul className={`space-y-2 ${tokens.typography.sizes.sm} text-content-secondary`}>
                {workout.cooldown.map((item, i) => (
                  <li key={i} className={`flex ${tokens.gap.tight}`}>
                    <span className="text-content-tertiary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Workout Stats */}
          <Separator spacing="sm" />
          <div className={`flex items-center justify-between ${tokens.typography.sizes.xs}`}>
            <div className={`flex items-center ${tokens.gap.default} text-content-tertiary`}>
              <div className={`flex items-center ${tokens.gap.element}`}>
                <TrendingUp className={tokens.icons.xs} />
                <span>{formatDistanceWithLengths(workout.totalDistance, poolLength)} total</span>
              </div>
              <div className={`flex items-center ${tokens.gap.element}`}>
                <Clock className={tokens.icons.xs} />
                <span>~{workout.estimatedTime} minutes</span>
              </div>
            </div>

            {!workout.completed && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleComplete}
                leftIcon={<CheckCircle2 className={tokens.icons.xs} />}
              >
                Complete
              </Button>
            )}
          </div>

          {/* Actual Performance (if completed) */}
          {workout.completed && workout.actualPerformance && (
            <>
              <Separator spacing="sm" />
              <div>
              <h4 className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} text-green-400 ${tokens.margin.element}`}>Your Performance</h4>
              <div className={`flex items-center ${tokens.gap.default} ${tokens.typography.sizes.xs} text-content-secondary`}>
                <span>{(workout.actualPerformance.distance / 1000).toFixed(1)}km</span>
                <span>•</span>
                <span>{formatDuration(workout.actualPerformance.duration)}</span>
                <span>•</span>
                <span>{workout.actualPerformance.pace.toFixed(2)} min/100m pace</span>
              </div>
            </div>
            </>
          )}
          </div>
        </>
      )}
    </motion.div>
  );
};
