import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { TrendBadge } from '../components/TrendBadge';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { AchievementBadges } from '../components/AchievementBadges';
import { FunComparisons } from '../components/FunComparisons';
import { InsightsControls, InsightsSummary, InsightsMilestones, InsightsChart } from '../components/insights';
import { PageContainer, PageHeader } from '../components/layout';
import { BarChart3, LineChart as LineChartIcon, ScatterChart as ScatterIcon, Upload, Trophy, Zap, TrendingUp, Target, Calendar, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokens } from '../design/tokens';
import { useInsightsData } from '../hooks/useInsightsData';
import { calculateNextMilestones, checkAchievementBadges, generateFunComparisons } from '../utils/analytics';
import { formatDuration } from '../utils/formatters';

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
      blue: 'from-accent-blue/20 to-accent-blue/5 border-accent-blue/30',
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
          onClick={() => session && navigate(`/session/${session.id}`, { state: { from: '/insights', label: 'Insights' } })}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-dark-bg/50">
              <Icon className="w-8 h-8 text-accent-blue" />
            </div>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>

          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-2xl font-bold">{value}</span>
            {unit && <span className="text-lg text-gray-400">{unit}</span>}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
          )}

          {session && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-dark-border">
              <Calendar className="w-3 h-3" />
              {formatDate(session.date)}
            </div>
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
          <h1 className="font-display text-4xl font-bold mb-4">
            No Data to Visualize
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Upload some swims to see your performance trends!
          </p>
          <Link to="/upload" className="btn-primary">
            Upload Swim Data
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
        title="Performance Insights"
        actions={
          <>
            <Link
              to="/sessions"
              className="px-4 py-2 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <BarChart3 className={tokens.icons.sm} />
              <span className="hidden sm:inline">View Sessions</span>
            </Link>
            <Link
              to="/upload"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Upload className={tokens.icons.sm} />
              Upload
            </Link>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Time Range Controls */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-400">Time Range:</span>
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pace Chart */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold">Pace Over Time</h2>
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

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
              <span>Lower is better • min/100m</span>
            </div>
          </Card>

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
                chartType="line"
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

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
              <span>Distance per swim session (km)</span>
            </div>
          </Card>
        </div>

        {/* Milestones */}
        <InsightsMilestones milestones={milestones} />

        {/* Personal Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="font-display text-3xl font-bold mb-2">Personal Records</h2>
          <p className="text-gray-400 mb-6">Your best performances</p>

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
                  <p className="text-sm text-gray-400 mb-2">Total Distance</p>
                  <p className="font-display text-2xl font-bold text-accent-blue">
                    {(totalDistance / 1000).toFixed(1)} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    That's {Math.round(totalDistance / 25)} lengths!
                  </p>
                </div>

                <div className="text-center p-6 bg-dark-bg rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Total Strokes</p>
                  <p className="font-display text-2xl font-bold text-primary-400">
                    {totalStrokes.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg {Math.round(totalStrokes / sessions.length)} per swim
                  </p>
                </div>

                <div className="text-center p-6 bg-dark-bg rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Average Pace</p>
                  <p className="font-display text-2xl font-bold text-accent-blue">
                    {formatPace(avgPace)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">min/100m overall</p>
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

          <p className="text-center text-sm text-gray-500">
            Click on any record to view the full session details
          </p>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};
