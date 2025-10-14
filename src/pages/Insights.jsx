import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { TrendBadge } from '../components/TrendBadge';
import { InsightsControls, InsightsSummary, InsightsMilestones, InsightsChart } from '../components/insights';
import { PageContainer, PageHeader } from '../components/layout';
import { BarChart3, LineChart as LineChartIcon, ScatterChart as ScatterIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokens } from '../design/tokens';
import { useInsightsData } from '../hooks/useInsightsData';

export const Insights = () => {
  const { sessions } = useSwimData();
  const [timeRange, setTimeRange] = useState(30); // days
  const [metric, setMetric] = useState('pace'); // pace, distance, swolf
  const [granularity, setGranularity] = useState('session'); // session, daily, weekly
  const [showRollingAvg, setShowRollingAvg] = useState(false);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [chartType, setChartType] = useState('line'); // line, bar, scatter
  const [showCompare, setShowCompare] = useState(false);

  // Use custom hook for data processing
  const {
    compareData,
    enrichedChartData,
    stats,
    trends,
    currentTrend,
    consistencyScore,
    sparklineData,
    milestones,
    scatterData,
    previousWindowData
  } = useInsightsData(sessions, timeRange, granularity, metric);

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
        {/* Controls */}
        <InsightsControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          metric={metric}
          setMetric={setMetric}
          granularity={granularity}
          setGranularity={setGranularity}
        />

        {/* Chart */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-2xl font-bold">
                  {metric === 'pace' && 'Pace Over Time'}
                  {metric === 'distance' && 'Distance Analysis'}
                  {metric === 'swolf' && 'SWOLF Efficiency'}
                </h2>
                <TrendBadge trend={currentTrend.trend} metric={metric} />
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'line'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                  title="Line Chart"
                >
                  <LineChartIcon className="w-5 h-5" />
                </button>
                {metric === 'distance' && granularity === 'weekly' && (
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded-lg transition-colors ${
                      chartType === 'bar'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-card text-gray-400 hover:text-gray-200'
                    }`}
                    title="Bar Chart"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setChartType('scatter')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'scatter'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                  title="Scatter Plot (Pace vs SWOLF)"
                  disabled={scatterData.length < 2}
                >
                  <ScatterIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chart Controls */}
            {chartType === 'line' && (
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={showRollingAvg}
                    onChange={(e) => setShowRollingAvg(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                  <span>3-Point Avg</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={showTrendLine}
                    onChange={(e) => setShowTrendLine(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                  <span>Trend Line ({currentTrend.percentChange > 0 ? '+' : ''}{currentTrend.percentChange}%)</span>
                </label>
                {previousWindowData.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={showCompare}
                      onChange={(e) => setShowCompare(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-dark-card text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <span>Compare ({compareData.deltas?.pace > 0 ? '+' : ''}{compareData.deltas?.pace}%)</span>
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <InsightsChart
                chartType={chartType}
                metric={metric}
                enrichedChartData={enrichedChartData}
                scatterData={scatterData}
                stats={stats}
                showRollingAvg={showRollingAvg}
                showTrendLine={showTrendLine}
                showCompare={showCompare}
                previousWindowData={previousWindowData}
                getMilestoneType={getMilestoneType}
                granularity={granularity}
              />
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500 flex-wrap">
            {chartType === 'line' && (
              <>
                <span>
                  {metric === 'pace' && 'Lower is better • Showing pace in min/100m'}
                  {metric === 'distance' && 'Total distance per swim session'}
                  {metric === 'swolf' && 'Lower SWOLF = better efficiency'}
                </span>
                {(showRollingAvg || showTrendLine || showCompare) && (
                  <span className="text-gray-600">|</span>
                )}
                {showRollingAvg && (
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-purple-400" style={{ borderTop: '2px dashed' }}></span>
                    <span className="text-purple-400">3-Point Avg</span>
                  </span>
                )}
                {showTrendLine && (
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-orange-500" style={{ borderTop: '2px dashed' }}></span>
                    <span className="text-orange-500">Trend</span>
                  </span>
                )}
                {showCompare && (
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-gray-500" style={{ borderTop: '2px dashed' }}></span>
                    <span className="text-gray-400">Previous Window</span>
                  </span>
                )}
              </>
            )}
            {chartType === 'bar' && (
              <span>Weekly distance totals • Purple line shows average</span>
            )}
            {chartType === 'scatter' && (
              <span>
                Speed vs Efficiency • Bubble size = distance • Top-left quadrant = best performance
              </span>
            )}
          </div>
        </Card>

        {/* Summary Stats */}
        <InsightsSummary
          stats={stats}
          compareData={compareData}
          trends={trends}
          sparklineData={sparklineData}
          consistencyScore={consistencyScore}
        />

        {/* Milestones */}
        <InsightsMilestones milestones={milestones} />
      </motion.div>
    </PageContainer>
  );
};
