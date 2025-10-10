import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { InsightStatCard } from '../components/InsightStatCard';
import { TrendBadge } from '../components/TrendBadge';
import { PageContainer, PageHeader } from '../components/layout';
import { TrendingUp, Activity, Zap, Calendar, Award, Star, BarChart3, LineChart as LineChartIcon, ScatterChart as ScatterIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokens } from '../design/tokens';
import {
  aggregateByDay,
  aggregateByWeek,
  getCompareData,
  calculateLinearRegression,
  calculateConsistencyScore,
  calculateRollingAverage,
  findMilestones
} from '../utils/analytics';

export const Insights = () => {
  const { sessions } = useSwimData();
  const [timeRange, setTimeRange] = useState(30); // days
  const [metric, setMetric] = useState('pace'); // pace, distance, swolf
  const [granularity, setGranularity] = useState('session'); // session, daily, weekly
  const [showRollingAvg, setShowRollingAvg] = useState(false);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [chartType, setChartType] = useState('line'); // line, bar, scatter
  const [showCompare, setShowCompare] = useState(false);

  // Filter sessions by time range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  const filteredSessions = sessions
    .filter(s => new Date(s.date) >= startDate && new Date(s.date) <= endDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first for charts

  // Get comparison data for deltas
  const compareData = getCompareData(sessions, timeRange);

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

  // Prepare chart data based on granularity
  let processedData = filteredSessions;

  if (granularity === 'daily') {
    processedData = aggregateByDay(filteredSessions);
  } else if (granularity === 'weekly') {
    processedData = aggregateByWeek(filteredSessions);
  }

  const chartData = processedData.map((item, index) => {
    // Handle different data structures based on granularity
    if (granularity === 'session') {
      return {
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: new Date(item.date).toLocaleDateString(),
        pace: item.pace,
        paceSeconds: item.pace * 60,
        distance: item.distance / 1000,
        swolf: item.swolf,
        id: item.id,
        index
      };
    } else if (granularity === 'daily') {
      return {
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: new Date(item.date).toLocaleDateString(),
        pace: item.avgPace,
        paceSeconds: item.avgPace * 60,
        distance: item.totalDistance / 1000,
        swolf: item.avgSwolf,
        count: item.count,
        index
      };
    } else {
      // weekly
      return {
        date: new Date(item.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: `Week of ${new Date(item.weekStart).toLocaleDateString()}`,
        pace: item.avgPace,
        paceSeconds: item.avgPace * 60,
        distance: item.totalDistance / 1000,
        swolf: item.avgSwolf,
        count: item.count,
        index
      };
    }
  });

  // Custom tooltip with deltas
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const dataIndex = enrichedChartData.findIndex(d => d.date === data.date);
      const previousData = dataIndex > 0 ? enrichedChartData[dataIndex - 1] : null;

      // Calculate delta vs previous session
      const calculateDelta = (current, previous, metric) => {
        if (!previous || !current || !previous) return null;
        const delta = current - previous;
        const percentDelta = previous !== 0 ? ((delta / previous) * 100).toFixed(1) : 0;

        // For pace and swolf, negative is better
        const isImprovement = (metric === 'pace' || metric === 'swolf') ? delta < 0 : delta > 0;

        return { delta, percentDelta, isImprovement };
      };

      let deltaInfo = null;
      let currentValue = 0;

      if (metric === 'pace' && previousData) {
        currentValue = data.pace;
        deltaInfo = calculateDelta(data.pace, previousData.pace, 'pace');
      } else if (metric === 'distance' && previousData) {
        currentValue = data.distance;
        deltaInfo = calculateDelta(data.distance, previousData.distance, 'distance');
      } else if (metric === 'swolf' && data.swolf > 0 && previousData?.swolf > 0) {
        currentValue = data.swolf;
        deltaInfo = calculateDelta(data.swolf, previousData.swolf, 'swolf');
      }

      const milestoneType = getMilestoneType(data);

      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="text-sm text-gray-400 mb-2">{data.fullDate}</p>

          {milestoneType && (
            <div className="mb-2 px-2 py-1 bg-yellow-500/20 rounded text-yellow-400 text-xs font-semibold flex items-center gap-1">
              ⭐ {milestoneType === 'bestPace' ? 'Best Pace' : milestoneType === 'longestSwim' ? 'Longest Swim' : 'Best SWOLF'}
            </div>
          )}

          {metric === 'pace' && (
            <div>
              <p className="font-display font-semibold text-accent-blue text-lg">
                {formatPace(data.pace)}
              </p>
              <p className="text-xs text-gray-500">min/100m</p>
            </div>
          )}
          {metric === 'distance' && (
            <div>
              <p className="font-display font-semibold text-accent-blue text-lg">
                {data.distance.toFixed(2)} km
              </p>
            </div>
          )}
          {metric === 'swolf' && data.swolf > 0 && (
            <div>
              <p className="font-display font-semibold text-accent-blue text-lg">
                SWOLF: {data.swolf}
              </p>
            </div>
          )}

          {deltaInfo && (
            <div className={`mt-2 text-xs ${deltaInfo.isImprovement ? 'text-green-400' : 'text-red-400'}`}>
              {deltaInfo.isImprovement ? '↑' : '↓'} {deltaInfo.isImprovement ? '+' : ''}{deltaInfo.percentDelta}% vs prev
            </div>
          )}

          {granularity !== 'session' && data.count && (
            <div className="mt-2 text-xs text-gray-500">
              {data.count} swim{data.count > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate stats for current period
  const validPaceData = chartData.filter(d => d.pace > 0);
  const validSwolfData = chartData.filter(d => d.swolf > 0);

  const stats = {
    avgPace: validPaceData.length > 0
      ? validPaceData.reduce((sum, d) => sum + d.pace, 0) / validPaceData.length
      : 0,
    totalDistance: chartData.reduce((sum, d) => sum + d.distance, 0),
    avgSwolf: validSwolfData.length > 0
      ? validSwolfData.reduce((sum, d) => sum + d.swolf, 0) / validSwolfData.length
      : 0,
    count: filteredSessions.length
  };

  // Calculate trends using linear regression
  const paceTrend = calculateLinearRegression(validPaceData, 'index', 'pace');
  const distanceTrend = calculateLinearRegression(chartData, 'index', 'distance');
  const swolfTrend = calculateLinearRegression(validSwolfData, 'index', 'swolf');

  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(filteredSessions, timeRange);

  // Prepare sparkline data (last 7-10 points)
  const sparklineCount = Math.min(10, chartData.length);
  const paceSparkline = validPaceData.slice(-sparklineCount).map(d => ({ value: d.pace }));
  const distanceSparkline = chartData.slice(-sparklineCount).map(d => ({ value: d.distance }));
  const swolfSparkline = validSwolfData.slice(-sparklineCount).map(d => ({ value: d.swolf }));

  // Calculate rolling averages for chart overlay
  const getMetricKey = () => {
    if (metric === 'pace') return 'paceSeconds';
    return metric;
  };

  const metricKey = getMetricKey();
  const chartDataWithRollingAvg = calculateRollingAverage(chartData, metricKey, 3);

  // Generate trend line data points
  const currentTrend = metric === 'pace' ? paceTrend : metric === 'distance' ? distanceTrend : swolfTrend;

  // Merge all overlay data into chart data
  const enrichedChartData = chartData.map((point, index) => {
    const rollingPoint = chartDataWithRollingAvg[index];
    return {
      ...point,
      rollingAvg: rollingPoint?.[`${metricKey}RollingAvg`],
      trendValue: currentTrend.slope * index + currentTrend.intercept
    };
  });

  // Find milestones in current window
  const milestones = findMilestones(filteredSessions);

  // Prepare scatter plot data (Pace vs SWOLF) - needed for domain calculation
  const scatterData = filteredSessions
    .filter(s => s.pace > 0 && s.swolf > 0)
    .map(s => ({
      pace: s.pace,
      swolf: s.swolf,
      distance: s.distance / 1000,
      date: new Date(s.date).toLocaleDateString(),
      id: s.id
    }));

  // Calculate dynamic Y-axis domain with padding for better visibility
  const calculateDomain = (data, metricKey) => {
    if (!data || data.length === 0) return [0, 100];

    const values = data
      .map(d => d[metricKey])
      .filter(v => v !== null && v !== undefined && !isNaN(v) && v > 0);

    if (values.length === 0) return [0, 100];

    const min = Math.min(...values);
    const max = Math.max(...values);

    // If all values are the same, add fixed padding
    if (min === max) {
      return [Math.max(0, min * 0.9), min * 1.1];
    }

    // Add 15% padding on each side for better visualization
    const range = max - min;
    const padding = range * 0.15;

    return [
      Math.max(0, min - padding),
      max + padding
    ];
  };

  // Calculate domains for each chart type and metric
  const lineChartDomain = calculateDomain(
    enrichedChartData,
    metric === 'pace' ? 'paceSeconds' : metric
  );

  const barChartDomain = calculateDomain(enrichedChartData, 'distance');

  const scatterPaceDomain = calculateDomain(scatterData, 'pace');
  const scatterSwolfDomain = calculateDomain(scatterData, 'swolf');

  // Render chart based on type
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={enrichedChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={barChartDomain}
            tickFormatter={(value) => `${value.toFixed(1)}km`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="distance" fill="#00d4ff" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={800} />
          <ReferenceLine
            y={stats.totalDistance / enrichedChartData.length}
            stroke="#a78bfa"
            strokeDasharray="5 5"
            label={{ value: 'Avg', position: 'right', fill: '#a78bfa' }}
          />
        </BarChart>
      );
    }

    if (chartType === 'scatter') {
      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            type="number"
            dataKey="pace"
            name="Pace"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={scatterPaceDomain}
            tickFormatter={(value) => formatPace(value)}
            label={{ value: 'Pace (min/100m)', position: 'bottom', fill: '#6b7280' }}
          />
          <YAxis
            type="number"
            dataKey="swolf"
            name="SWOLF"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={scatterSwolfDomain}
            label={{ value: 'SWOLF', angle: -90, position: 'left', fill: '#6b7280' }}
          />
          <ZAxis type="number" dataKey="distance" range={[50, 400]} name="Distance" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm text-gray-400 mb-2">{data.date}</p>
                    <p className="text-sm">
                      <span className="text-gray-400">Pace:</span>{' '}
                      <span className="font-semibold text-accent-blue">{formatPace(data.pace)}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">SWOLF:</span>{' '}
                      <span className="font-semibold text-accent-blue">{data.swolf}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Distance:</span>{' '}
                      <span className="font-semibold text-accent-blue">{data.distance.toFixed(2)} km</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={scatterData} fill="#00d4ff" isAnimationActive animationDuration={800} />
          {scatterData.length > 0 && (
            <>
              <ReferenceLine
                x={scatterData.reduce((sum, d) => sum + d.pace, 0) / scatterData.length}
                stroke="#a78bfa"
                strokeDasharray="5 5"
                label={{ value: 'Avg Pace', position: 'top', fill: '#a78bfa' }}
              />
              <ReferenceLine
                y={scatterData.reduce((sum, d) => sum + d.swolf, 0) / scatterData.length}
                stroke="#a78bfa"
                strokeDasharray="5 5"
                label={{ value: 'Avg SWOLF', position: 'right', fill: '#a78bfa' }}
              />
            </>
          )}
        </ScatterChart>
      );
    }

    // Default: line chart
    return (
      <AreaChart data={enrichedChartData}>
        <defs>
          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={lineChartDomain}
          tickFormatter={(value) => {
            if (metric === 'pace') return `${Math.floor(value / 60)}:${(value % 60).toFixed(0).padStart(2, '0')}`;
            if (metric === 'distance') return `${value.toFixed(1)}km`;
            return value.toFixed(0);
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={metric === 'pace' ? 'paceSeconds' : metric}
          stroke="#00d4ff"
          strokeWidth={3}
          fill="url(#colorMetric)"
          dot={(props) => {
            const milestoneType = getMilestoneType(props.payload);
            if (milestoneType) {
              return (
                <g>
                  <circle cx={props.cx} cy={props.cy} r={8} fill="#fbbf24" stroke="#fbbf24" strokeWidth={2} />
                  <text x={props.cx} y={props.cy - 15} fill="#fbbf24" fontSize="20" textAnchor="middle">⭐</text>
                </g>
              );
            }
            return <circle cx={props.cx} cy={props.cy} r={5} fill="#00d4ff" />;
          }}
          activeDot={{ r: 7, fill: '#00d4ff' }}
          isAnimationActive
          animationDuration={800}
        />
        {showRollingAvg && (
          <Line
            type="monotone"
            dataKey="rollingAvg"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive
            animationDuration={800}
          />
        )}
        {showTrendLine && (
          <Line
            type="monotone"
            dataKey="trendValue"
            stroke="#f97316"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
            isAnimationActive
            animationDuration={800}
          />
        )}
        {showCompare && previousWindowData.length > 0 && (
          <Line
            type="monotone"
            data={previousWindowData}
            dataKey={metric === 'pace' ? 'paceSeconds' : metric}
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
            opacity={0.4}
            isAnimationActive
            animationDuration={800}
          />
        )}
      </AreaChart>
    );
  };

  // Mark milestone points on chart
  const getMilestoneType = (point) => {
    if (!point.id) return null;
    if (milestones?.bestPace?.id === point.id && metric === 'pace') return 'bestPace';
    if (milestones?.longestSwim?.id === point.id && metric === 'distance') return 'longestSwim';
    if (milestones?.bestSwolf?.id === point.id && metric === 'swolf') return 'bestSwolf';
    return null;
  };

  // Prepare previous window data for compare mode
  const previousWindowData = showCompare && compareData.previous.length > 0
    ? compareData.previous
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((session, index) => ({
          date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pace: session.pace,
          paceSeconds: session.pace * 60,
          distance: session.distance / 1000,
          swolf: session.swolf,
          index
        }))
    : [];

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
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-400 mb-2">Time Range</p>
            <div className="flex gap-2 flex-wrap">
              {[7, 30, 90, 180, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeRange === days
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {days === 7 ? '7 Days' : days === 30 ? '30 Days' : days === 90 ? '90 Days' : days === 180 ? '6 Months' : '12 Months'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Metric</p>
            <div className="flex gap-2">
              <button
                onClick={() => setMetric('pace')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  metric === 'pace'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                Pace
              </button>
              <button
                onClick={() => setMetric('distance')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  metric === 'distance'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Distance
              </button>
              <button
                onClick={() => setMetric('swolf')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  metric === 'swolf'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-gray-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                SWOLF
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Granularity</p>
            <div className="flex gap-2">
              {[
                { value: 'session', label: 'Session' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setGranularity(value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    granularity === value
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 ${tokens.gap.default} mb-8`}>
          <InsightStatCard
            label="Avg Pace"
            value={formatPace(stats.avgPace)}
            unit="min/100m"
            delta={compareData.deltas?.pace}
            trend={paceTrend.trend}
            sparklineData={paceSparkline}
            icon={Activity}
            metricName="Pace"
          />

          <InsightStatCard
            label="Total Distance"
            value={stats.totalDistance.toFixed(1)}
            unit="km"
            delta={compareData.deltas?.distance}
            trend={distanceTrend.trend}
            sparklineData={distanceSparkline}
            icon={TrendingUp}
            metricName="Distance"
          />

          {!isNaN(stats.avgSwolf) && stats.avgSwolf > 0 && (
            <InsightStatCard
              label="Avg SWOLF"
              value={Math.round(stats.avgSwolf)}
              delta={compareData.deltas?.swolf}
              trend={swolfTrend.trend}
              sparklineData={swolfSparkline}
              icon={Zap}
              metricName="SWOLF"
            />
          )}

          <InsightStatCard
            label="Consistency Score"
            value={consistencyScore}
            unit="/100"
            icon={Award}
            metricName="Consistency"
          />
        </div>

        {/* Milestones */}
        {milestones && (
          <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.compact} mb-8`}>
            {milestones.bestPace && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">⭐</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Best Pace</p>
                      <p className="font-display text-xl font-bold text-yellow-400">
                        {formatPace(milestones.bestPace.pace)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(milestones.bestPace.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {milestones.longestSwim && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏊</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Longest Swim</p>
                      <p className="font-display text-xl font-bold text-yellow-400">
                        {(milestones.longestSwim.distance / 1000).toFixed(2)} km
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(milestones.longestSwim.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {milestones.bestSwolf && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">⚡</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Best SWOLF</p>
                      <p className="font-display text-xl font-bold text-yellow-400">
                        {milestones.bestSwolf.swolf}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(milestones.bestSwolf.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}

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
              {renderChart()}
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
      </motion.div>
    </PageContainer>
  );
};
