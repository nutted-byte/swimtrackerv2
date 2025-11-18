import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { CardVariant, IconContainer, Separator } from '../components/primitives';
import { Button } from '../components/Button';
import { TrendBadge } from '../components/TrendBadge';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { AchievementBadges } from '../components/AchievementBadges';
import { FunComparisons } from '../components/FunComparisons';
import { InsightsControls, InsightsSummary, InsightsChart, PerformanceAnalysis } from '../components/insights';
import { PageContainer, PageHeader } from '../components/layout';
import { BarChart3, LineChart as LineChartIcon, ScatterChart as ScatterIcon, Upload, Trophy, Zap, TrendingUp, Target, Calendar, Award, Sparkles, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokens } from '../design/tokens';
import { useInsightsData } from '../hooks/useInsightsData';
import { calculateNextMilestones, checkAchievementBadges, generateFunComparisons } from '../utils/analytics';
import { formatDuration } from '../utils/formatters';
import { querySwimData, getExampleQueries, suggestDateRangeForQuery } from '../utils/ai/llmQuery';

export const Insights = () => {
  const navigate = useNavigate();
  const { sessions } = useSwimData();
  const [timeRange, setTimeRange] = useState(90); // days (3 months)
  const [metric, setMetric] = useState('pace'); // pace, distance, swolf
  const granularity = 'session'; // Fixed to session view
  const [showRollingAvg, setShowRollingAvg] = useState(false);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [chartType, setChartType] = useState('line'); // line, bar, scatter
  const [showCompare, setShowCompare] = useState(false);

  // Swim Coach state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [error, setError] = useState(null);

  const exampleQueries = getExampleQueries();

  // Use custom hook for data processing - Pace
  const {
    compareData,
    enrichedChartData: paceChartData,
    stats,
    trends,
    currentTrend,
    consistencyScore,
    sparklineData,
    milestones,
    scatterData,
    previousWindowData
  } = useInsightsData(sessions, timeRange, granularity, 'pace');

  // Get distance data separately
  const {
    enrichedChartData: distanceChartData,
  } = useInsightsData(sessions, timeRange, granularity, 'distance');

  // Get duration/calories data separately
  const {
    enrichedChartData: durationCaloriesData,
  } = useInsightsData(sessions, timeRange, granularity, 'duration');

  // Get DPS data separately
  const {
    enrichedChartData: dpsChartData,
  } = useInsightsData(sessions, timeRange, granularity, 'dps');

  // Calculate records for Records section
  const records = {
    fastestPace: sessions
      .filter(s => s.pace > 0)
      .reduce((best, s) => !best || s.pace < best.pace ? s : best, null),

    longestDistance: sessions
      .reduce((best, s) => !best || s.distance > best.distance ? s : best, null),

    bestSwolf: sessions
      .filter(s => s.swolf > 0)
      .reduce((best, s) => !best || s.swolf < best.swolf ? s : best, null),

    mostStrokes: sessions
      .filter(s => s.strokes > 0)
      .reduce((best, s) => !best || s.strokes > best.strokes ? s : best, null),

    longestDuration: sessions
      .reduce((best, s) => !best || s.duration > best.duration ? s : best, null),
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const RecordCard = ({ title, value, unit, subtitle, icon: Icon, session, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-primary-50 to-blue-50 border-primary-200',
      coral: 'from-accent-coral/20 to-accent-coral/5 border-accent-coral/30',
      teal: 'from-primary-500/20 to-primary-500/5 border-primary-500/30',
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`bg-gradient-to-br ${colorClasses[color]} cursor-pointer`}
          onClick={() => session && navigate(`/swim/${session.id}`, { state: { from: '/insight', label: 'Insight' } })}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 rounded-xl bg-dark-bg/50">
              <Icon className={`${tokens.icons.xl} text-accent-blue`} />
            </div>
            <Trophy className={`${tokens.icons.lg} text-yellow-500`} />
          </div>

          <h3 className="text-sm text-content-tertiary uppercase tracking-wide mb-2">
            {title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-2xl font-bold">{value}</span>
            {unit && <span className="text-lg text-content-tertiary">{unit}</span>}
          </div>

          {subtitle && (
            <p className="text-sm text-content-tertiary mb-4">{subtitle}</p>
          )}

          {session && (
            <>
              <Separator spacing="sm" />
              <div className="flex items-center gap-2 text-xs text-content-tertiary">
                <Calendar className={tokens.icons.xs} />
                {formatDate(session.date)}
              </div>
            </>
          )}
        </Card>
      </motion.div>
    );
  };

  // Calculate stats for Records section
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalStrokes = sessions.reduce((sum, s) => sum + s.strokes, 0);
  const avgPace = sessions.filter(s => s.pace > 0).reduce((sum, s) => sum + s.pace, 0) / sessions.filter(s => s.pace > 0).length;

  // Calculate milestones, badges, and comparisons
  const recordMilestones = calculateNextMilestones(records, sessions);
  const badges = checkAchievementBadges(sessions, records);
  const comparisons = generateFunComparisons(sessions);

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

  // No auto-scroll needed since newest messages appear at top

  const handleCoachSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || coachLoading) return;

    const question = input.trim();
    // Don't clear input - keep it visible
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
    // Just fill the input box, let user click Send
    setInput(question);
  };

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">📈</div>
          <h1 className={`${tokens.typography.families.display} ${tokens.typography.sizes['4xl']} ${tokens.typography.weights.bold} mb-4`}>
            No Data to Visualize
          </h1>
          <p className={`${tokens.typography.sizes.xl} text-content-tertiary mb-8`}>
            Upload some swims to see your performance trends!
          </p>
          <Link to="/upload">
            <Button>Upload Swim Data</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Mark milestone points on chart
  const getMilestoneType = (point) => {
    if (!point.id) return null;
    if (milestones?.bestPace?.id === point.id && metric === 'pace') return 'bestPace';
    if (milestones?.longestSwim?.id === point.id && metric === 'distance') return 'longestSwim';
    if (milestones?.bestSwolf?.id === point.id && metric === 'swolf') return 'bestSwolf';
    return null;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Performance Insight"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Time Range Controls */}
        <Card className="p-4 mb-6">
          {/* Desktop: Buttons */}
          <div className="hidden md:flex items-center gap-4 flex-wrap">
            <span className="text-sm text-content-tertiary">Time Range:</span>
            {[
              { value: 7, label: '7 days' },
              { value: 30, label: '1 month' },
              { value: 90, label: '3 months' },
              { value: 180, label: '6 months' },
              { value: 365, label: '1 year' },
              { value: Infinity, label: 'All time' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-content-tertiary hover:text-content-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile: Dropdown */}
          <div className="md:hidden">
            <label htmlFor="timeRange" className="block text-sm text-content-tertiary mb-2">
              Time Range:
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value === 'Infinity' ? Infinity : Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark-card text-white focus:outline-none"
            >
              <option value="7">7 days</option>
              <option value="30">1 month</option>
              <option value="90">3 months</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="Infinity">All time</option>
            </select>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distance Chart */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold">Distance Over Time</h2>
                </div>
              </div>
            </div>

            <div className="h-80">
              <InsightsChart
                chartType="bar"
                metric="distance"
                enrichedChartData={distanceChartData}
                scatterData={scatterData}
                stats={stats}
                showRollingAvg={false}
                showTrendLine={false}
                showCompare={false}
                previousWindowData={previousWindowData}
                getMilestoneType={getMilestoneType}
                granularity={granularity}
              />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-content-tertiary">
              <span>Distance per swim session (km)</span>
            </div>
          </Card>

          {/* Pace Chart */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold">Pace & SWOLF Over Time</h2>
                  <TrendBadge trend={currentTrend.trend} metric="pace" />
                </div>
              </div>
            </div>

            <div className="h-80">
              <InsightsChart
                chartType="line"
                metric="pace"
                enrichedChartData={paceChartData}
                scatterData={scatterData}
                stats={stats}
                showRollingAvg={false}
                showTrendLine={false}
                showCompare={false}
                previousWindowData={previousWindowData}
                getMilestoneType={getMilestoneType}
                granularity={granularity}
              />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-content-tertiary">
              <div className="flex items-center gap-2">
                <div className={`${tokens.icons.xs} rounded-full bg-accent-blue`}></div>
                <span>Pace (min/100m) - Higher is faster</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${tokens.icons.xs} rounded-full bg-purple-400`}></div>
                <span>SWOLF - Lower is better</span>
              </div>
            </div>
          </Card>

          {/* DPS (Stroke Efficiency) Chart */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold">Stroke Efficiency (DPS)</h2>
                </div>
              </div>
            </div>

            <div className="h-80">
              <InsightsChart
                chartType="line"
                metric="dps"
                enrichedChartData={dpsChartData}
                scatterData={scatterData}
                stats={stats}
                showRollingAvg={false}
                showTrendLine={false}
                showCompare={false}
                previousWindowData={previousWindowData}
                getMilestoneType={getMilestoneType}
                granularity={granularity}
              />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-content-tertiary">
              <span>Distance Per Stroke - Higher is better</span>
            </div>
          </Card>

          {/* Duration & Calories Chart */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold">Duration & Calories</h2>
                </div>
              </div>
            </div>

            <div className="h-80">
              <InsightsChart
                chartType="dual-bar"
                metric="duration"
                enrichedChartData={durationCaloriesData}
                scatterData={scatterData}
                stats={stats}
                showRollingAvg={false}
                showTrendLine={false}
                showCompare={false}
                previousWindowData={previousWindowData}
                getMilestoneType={getMilestoneType}
                granularity={granularity}
              />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-content-tertiary">
              <div className="flex items-center gap-2">
                <div className={`${tokens.icons.xs} rounded-full bg-accent-blue`}></div>
                <span>Duration (mins)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${tokens.icons.xs} rounded-full bg-purple-400`}></div>
                <span>Calories burned</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Performance Analysis */}
        <PerformanceAnalysis
          sessions={sessions.filter(s => {
            if (timeRange === null || timeRange === Infinity) return true;
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - timeRange);
            return new Date(s.date) >= startDate && new Date(s.date) <= endDate;
          })}
          stats={stats}
          trends={trends}
          milestones={milestones}
          consistencyScore={consistencyScore}
          timeRange={timeRange === Infinity ? null : timeRange}
        />

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

          {/* Welcome message / Example queries - Always visible */}
          {sessions.length > 0 && (
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
                            className="text-left justify-start group !bg-white hover:!bg-primary-500 hover:!text-white"
                          >
                            <MessageCircle className={`${tokens.icons.sm} text-primary-400 group-hover:text-white flex-shrink-0 transition-colors`} />
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

          {/* Input form */}
          {sessions.length > 0 && (
            <Card className="bg-dark-card mb-6">
              <form onSubmit={handleCoachSubmit} className={`flex ${tokens.gap.default}`}>
                <input
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

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
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

          {/* AI Responses - Show conversation history (newest first) */}
          {messages.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.filter(m => m.role === 'assistant').reverse().map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <div className="text-content-secondary whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      {message.usage && (
                        <div className={`mt-4 pt-4 flex items-center ${tokens.gap.tight} ${tokens.typography.sizes.xs} text-content-tertiary border-t border-gray-800`}>
                          <Sparkles className={tokens.icons.xs} />
                          <span>
                            {message.usage.inputTokens + message.usage.outputTokens} tokens
                          </span>
                          {message.cached && (
                            <span className={`px-2 py-0.5 bg-green-500/20 text-green-400 ${tokens.radius.sm}`}>
                              Cached
                            </span>
                          )}
                          <span className="ml-auto text-content-tertiary">
                            {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
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
            </div>
          )}
        </motion.div>

        {/* Personal Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="font-display text-3xl font-bold mb-2">Personal Records</h2>
          <p className="text-content-tertiary mb-6">Your best performances</p>

          <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default} mb-8`}>
            {records.fastestPace && (
              <RecordCard
                title="Fastest Pace"
                value={formatPace(records.fastestPace.pace)}
                unit="min/100m"
                subtitle={`${records.fastestPace.distance}m swim`}
                icon={Zap}
                session={records.fastestPace}
                color="blue"
              />
            )}

            {records.longestDistance && (
              <RecordCard
                title="Longest Swim"
                value={(records.longestDistance.distance / 1000).toFixed(2)}
                unit="km"
                subtitle={formatDuration(records.longestDistance.duration)}
                icon={TrendingUp}
                session={records.longestDistance}
                color="teal"
              />
            )}

            {records.bestSwolf && (
              <RecordCard
                title="Best SWOLF"
                value={records.bestSwolf.swolf}
                subtitle="Most efficient swim"
                icon={Target}
                session={records.bestSwolf}
                color="blue"
              />
            )}
          </div>

          {/* Achievement Badges */}
          {badges && badges.length > 0 && (
            <div className="mb-8">
              <AchievementBadges badges={badges} />
            </div>
          )}

          {/* All-Time Stats - Collapsible */}
          <div className="mb-8">
            <CollapsibleSection
              title="All-Time Stats"
              subtitle={`${sessions.length} total swims`}
              icon={Award}
              defaultExpanded={false}
            >
              <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default} p-6 bg-dark-card rounded-lg`}>
                <div className="text-center p-6 bg-dark-bg rounded-lg">
                  <p className="text-sm text-content-tertiary mb-2">Total Distance</p>
                  <p className="font-display text-2xl font-bold text-accent-blue">
                    {(totalDistance / 1000).toFixed(1)} km
                  </p>
                  <p className="text-xs text-content-tertiary mt-1">
                    That's {Math.round(totalDistance / 25)} lengths!
                  </p>
                </div>

                <div className="text-center p-6 bg-dark-bg rounded-lg">
                  <p className="text-sm text-content-tertiary mb-2">Total Strokes</p>
                  <p className="font-display text-2xl font-bold text-primary-400">
                    {totalStrokes.toLocaleString()}
                  </p>
                  <p className="text-xs text-content-tertiary mt-1">
                    Avg {Math.round(totalStrokes / sessions.length)} per swim
                  </p>
                </div>

                <div className="text-center p-6 bg-dark-bg rounded-lg">
                  <p className="text-sm text-content-tertiary mb-2">Average Pace</p>
                  <p className="font-display text-2xl font-bold text-accent-blue">
                    {formatPace(avgPace)}
                  </p>
                  <p className="text-xs text-content-tertiary mt-1">min/100m overall</p>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Fun Comparisons - Collapsible */}
          {comparisons && (
            <div className="mb-8">
              <CollapsibleSection
                title="Fun Facts"
                subtitle="Your swimming in perspective"
                icon={Sparkles}
                defaultExpanded={false}
              >
                <FunComparisons comparisons={comparisons} />
              </CollapsibleSection>
            </div>
          )}

          <p className="text-center text-sm text-content-tertiary">
            Click on any record to view the full session details
          </p>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};
