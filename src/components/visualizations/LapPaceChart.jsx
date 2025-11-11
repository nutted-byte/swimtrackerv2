import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const LapPaceChart = ({ laps }) => {
  const chartData = useMemo(() => {
    if (!laps || laps.length === 0) return [];

    return laps.map((lap, index) => ({
      lapNumber: lap.number || index + 1,
      pace: lap.avgPace || lap.pace || 0,
      paceSeconds: (lap.avgPace || lap.pace || 0) * 60,
      distance: lap.distance,
      time: lap.duration
    }));
  }, [laps]);

  const avgPace = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, lap) => sum + lap.paceSeconds, 0) / chartData.length;
  }, [chartData]);

  const formatPace = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    const diffFromAvg = data.paceSeconds - avgPace;
    const isFaster = diffFromAvg < 0;

    return (
      <div className="bg-dark-card rounded-lg p-4 shadow-lg">
        <p className="font-bold text-sm mb-2">Lap {data.lapNumber}</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-content-secondary">Pace:</span>
            <span className="font-semibold">{formatPace(data.paceSeconds)}/100m</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-content-secondary">Time:</span>
            <span>{data.time}s</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-content-secondary">vs Average:</span>
            <span className={isFaster ? 'text-green-400' : 'text-orange-400'}>
              {isFaster ? '↑' : '↓'} {formatPace(Math.abs(diffFromAvg))}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-content-secondary">
        No lap data available for this session
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-card rounded-lg p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Lap-by-Lap Pace</h3>
        <p className="text-sm text-content-secondary">
          Average: <span className="font-semibold text-primary-400">{formatPace(avgPace)}/100m</span>
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="paceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.3}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />

            <XAxis
              dataKey="lapNumber"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ value: 'Lap Number', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
            />

            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => formatPace(value)}
              label={{ value: 'Pace (min/100m)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              reversed
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 212, 255, 0.1)' }} />

            <ReferenceLine
              y={avgPace}
              stroke="#00d4ff"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'Average',
                position: 'right',
                fill: '#00d4ff',
                fontSize: 12
              }}
            />

            <Bar
              dataKey="paceSeconds"
              fill="url(#paceGradient)"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lap insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-bg/50 rounded-lg p-4">
          <div className="text-xs text-content-secondary mb-2">Fastest Lap</div>
          <div className="font-bold text-green-400">
            Lap {chartData.reduce((fastest, lap, index) =>
              lap.paceSeconds < chartData[fastest].paceSeconds ? index : fastest, 0) + 1}
            <span className="text-sm text-content-secondary ml-2">
              ({formatPace(Math.min(...chartData.map(l => l.paceSeconds)))})
            </span>
          </div>
        </div>

        <div className="bg-dark-bg/50 rounded-lg p-4">
          <div className="text-xs text-content-secondary mb-2">Slowest Lap</div>
          <div className="font-bold text-orange-400">
            Lap {chartData.reduce((slowest, lap, index) =>
              lap.paceSeconds > chartData[slowest].paceSeconds ? index : slowest, 0) + 1}
            <span className="text-sm text-content-secondary ml-2">
              ({formatPace(Math.max(...chartData.map(l => l.paceSeconds)))})
            </span>
          </div>
        </div>

        <div className="bg-dark-bg/50 rounded-lg p-4">
          <div className="text-xs text-content-secondary mb-2">Pace Variation</div>
          <div className="font-bold text-primary-400">
            {formatPace(Math.max(...chartData.map(l => l.paceSeconds)) - Math.min(...chartData.map(l => l.paceSeconds)))}
            <span className="text-sm text-content-secondary ml-2">range</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
