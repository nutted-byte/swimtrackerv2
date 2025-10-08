import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { TrendingUp, Activity, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Insights = () => {
  const { sessions } = useSwimData();
  const [timeRange, setTimeRange] = useState(30); // days
  const [metric, setMetric] = useState('pace'); // pace, distance, swolf

  // Filter sessions by time range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  const filteredSessions = sessions
    .filter(s => new Date(s.date) >= startDate && new Date(s.date) <= endDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first for charts

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

  // Prepare chart data
  const chartData = filteredSessions.map(session => ({
    date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(session.date).toLocaleDateString(),
    pace: session.pace,
    // Convert pace to seconds for better visualization
    paceSeconds: session.pace * 60,
    distance: session.distance / 1000, // Convert to km
    swolf: session.swolf,
    id: session.id
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-400 mb-2">{data.fullDate}</p>
          {metric === 'pace' && (
            <p className="font-display font-semibold text-accent-blue">
              Pace: {formatPace(data.pace)}
            </p>
          )}
          {metric === 'distance' && (
            <p className="font-display font-semibold text-accent-blue">
              Distance: {data.distance.toFixed(2)} km
            </p>
          )}
          {metric === 'swolf' && data.swolf > 0 && (
            <p className="font-display font-semibold text-accent-blue">
              SWOLF: {data.swolf}
            </p>
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
  const stats = {
    avgPace: chartData.reduce((sum, d) => sum + d.pace, 0) / chartData.length,
    totalDistance: chartData.reduce((sum, d) => sum + d.distance, 0),
    avgSwolf: chartData.reduce((sum, d) => sum + (d.swolf || 0), 0) / chartData.filter(d => d.swolf > 0).length,
    count: chartData.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Performance Insights
          </h1>
          <p className="text-gray-400">
            Visualize your swimming progress over time
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-400 mb-2">Time Range</p>
            <div className="flex gap-2">
              {[7, 30, 90, 180].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeRange === days
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {days === 7 ? '1 Week' : days === 30 ? '1 Month' : days === 90 ? '3 Months' : '6 Months'}
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
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Swims</p>
                <p className="font-display text-3xl font-bold">{stats.count}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg Pace</p>
                <p className="font-display text-3xl font-bold">{formatPace(stats.avgPace)}</p>
                <p className="text-xs text-gray-500">min/100m</p>
              </div>
              <Activity className="w-8 h-8 text-accent-blue" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Distance</p>
                <p className="font-display text-3xl font-bold">{stats.totalDistance.toFixed(1)}</p>
                <p className="text-xs text-gray-500">km</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-400" />
            </div>
          </Card>

          {!isNaN(stats.avgSwolf) && stats.avgSwolf > 0 && (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg SWOLF</p>
                  <p className="font-display text-3xl font-bold">{Math.round(stats.avgSwolf)}</p>
                </div>
                <Zap className="w-8 h-8 text-accent-blue" />
              </div>
            </Card>
          )}
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h2 className="font-display text-2xl font-bold mb-6">
            {metric === 'pace' && 'Pace Over Time'}
            {metric === 'distance' && 'Distance Per Swim'}
            {metric === 'swolf' && 'SWOLF Efficiency'}
          </h2>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
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
                  dot={{ fill: '#00d4ff', r: 5 }}
                  activeDot={{ r: 7, fill: '#00d4ff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            {metric === 'pace' && 'Lower is better • Showing pace in min/100m'}
            {metric === 'distance' && 'Total distance per swim session'}
            {metric === 'swolf' && 'Lower SWOLF = better efficiency'}
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
