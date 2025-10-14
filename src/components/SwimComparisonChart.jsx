import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

/**
 * Mini comparison chart showing current swim vs recent average
 * @param {Object} currentSwim - The swim being analyzed
 * @param {Array} recentSwims - Recent swims for comparison (last 5)
 */
export const SwimComparisonChart = memo(({ currentSwim, recentSwims }) => {
  const chartData = useMemo(() => {
    if (!currentSwim || !recentSwims || recentSwims.length === 0) return { data: [], comparisonCount: 0 };

    // Calculate averages from recent swims (excluding current)
    const otherSwims = recentSwims.filter(s => s.id !== currentSwim.id).slice(0, 5);

    if (otherSwims.length === 0) return { data: [], comparisonCount: 0 };

    const avgPace = otherSwims.reduce((sum, s) => sum + s.pace, 0) / otherSwims.length;
    const avgDistance = otherSwims.reduce((sum, s) => sum + s.distance, 0) / otherSwims.length;
    const validSwolf = otherSwims.filter(s => s.swolf > 0);
    const avgSwolf = validSwolf.length > 0
      ? validSwolf.reduce((sum, s) => sum + s.swolf, 0) / validSwolf.length
      : null;

    const data = [
      {
        metric: 'Pace',
        current: currentSwim.pace,
        average: avgPace,
        unit: 'min/100m',
        inverse: true, // Lower is better
      },
      {
        metric: 'Distance',
        current: currentSwim.distance / 1000,
        average: avgDistance / 1000,
        unit: 'km',
        inverse: false, // Higher is better
      },
    ];

    // Add SWOLF if available
    if (currentSwim.swolf > 0 && avgSwolf) {
      data.push({
        metric: 'SWOLF',
        current: currentSwim.swolf,
        average: avgSwolf,
        unit: '',
        inverse: true, // Lower is better
      });
    }

    return { data, comparisonCount: otherSwims.length };
  }, [currentSwim, recentSwims]);

  if (chartData.data.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-4">
        Not enough data for comparison
      </div>
    );
  }

  // Determine color based on performance (green = better, red = worse)
  const getColor = (metric) => {
    const diff = metric.current - metric.average;
    const isBetter = metric.inverse ? diff < 0 : diff > 0;

    if (Math.abs(diff) < metric.average * 0.02) return '#6b7280'; // Gray - roughly same
    return isBetter ? '#10b981' : '#ef4444'; // Green or Red
  };

  // Format date range for comparison context
  const getComparisonDateRange = () => {
    if (!recentSwims || recentSwims.length === 0) return '';
    const dates = recentSwims
      .filter(s => s.id !== currentSwim.id)
      .slice(0, 5)
      .map(s => new Date(s.date))
      .sort((a, b) => a - b);

    if (dates.length === 0) return '';

    const oldest = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newest = dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return dates.length === 1 ? oldest : `${oldest} - ${newest}`;
  };

  return (
    <div className="bg-dark-bg/30 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Performance Comparison</h4>
          <p className="text-xs text-gray-500">
            vs average of your {chartData.comparisonCount} most recent swim{chartData.comparisonCount > 1 ? 's' : ''}
            {getComparisonDateRange() && ` (${getComparisonDateRange()})`}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData.data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis
            type="number"
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="metric"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={70}
          />
          <Bar dataKey="current" fill="#00d4ff" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {chartData.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 text-xs border-t border-dark-border/30 pt-3">
        {chartData.data.map((metric) => {
          const diff = metric.current - metric.average;
          const percentDiff = ((diff / metric.average) * 100).toFixed(1);
          const isBetter = metric.inverse ? diff < 0 : diff > 0;
          const symbol = isBetter ? '↑' : '↓';

          return (
            <div key={metric.metric} className="text-center">
              <div className="text-gray-500 mb-1">{metric.metric}</div>
              <div className="space-y-1">
                <div>
                  <div className="text-[10px] text-gray-600 uppercase">This swim</div>
                  <div className="font-semibold text-white text-sm">
                    {metric.current.toFixed(2)}{metric.unit}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase">Average</div>
                  <div className="text-gray-400 text-xs">
                    {metric.average.toFixed(2)}{metric.unit}
                  </div>
                </div>
              </div>
              <div className={`text-xs mt-1.5 font-medium ${isBetter ? 'text-green-400' : 'text-red-400'}`}>
                {symbol} {Math.abs(percentDiff)}% {isBetter ? 'better' : 'slower'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

SwimComparisonChart.displayName = 'SwimComparisonChart';
