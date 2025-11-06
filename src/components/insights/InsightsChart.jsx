import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { formatPace } from '../../utils/formatters';

/**
 * Calculate dynamic Y-axis domain with padding
 */
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

  // Add 15% padding on each side
  const range = max - min;
  const padding = range * 0.15;

  return [
    Math.max(0, min - padding),
    max + padding
  ];
};

/**
 * Custom tooltip component
 */
const CustomTooltip = ({ active, payload, metric, enrichedChartData, getMilestoneType, granularity }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dataIndex = enrichedChartData.findIndex(d => d.date === data.date);
    const previousData = dataIndex > 0 ? enrichedChartData[dataIndex - 1] : null;

    const calculateDelta = (current, previous, metric) => {
      if (!previous || !current) return null;
      const delta = current - previous;
      const percentDelta = previous !== 0 ? ((delta / previous) * 100).toFixed(1) : 0;
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
    } else if (metric === 'dps' && data.dps > 0 && previousData?.dps > 0) {
      currentValue = data.dps;
      deltaInfo = calculateDelta(data.dps, previousData.dps, 'dps');
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
          <div className="space-y-2">
            <div>
              <p className="font-display font-semibold text-accent-blue text-lg">
                {formatPace(data.pace)}
              </p>
              <p className="text-xs text-gray-500">min/100m</p>
            </div>
            {data.swolf > 0 && (
              <div className="pt-2 border-t border-dark-border">
                <p className="font-display font-semibold text-purple-400">
                  SWOLF: {data.swolf}
                </p>
                <p className="text-xs text-gray-500">efficiency score</p>
              </div>
            )}
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
        {metric === 'dps' && data.dps > 0 && (
          <div>
            <p className="font-display font-semibold text-accent-blue text-lg">
              {data.dps.toFixed(2)}m/stroke
            </p>
            <p className="text-xs text-gray-500">Distance Per Stroke</p>
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

/**
 * Main insights chart component
 */
export const InsightsChart = ({
  chartType,
  metric,
  enrichedChartData,
  scatterData,
  stats,
  showRollingAvg,
  showTrendLine,
  showCompare,
  previousWindowData,
  getMilestoneType,
  granularity
}) => {
  const lineChartDomain = calculateDomain(
    enrichedChartData,
    metric === 'pace' ? 'paceSeconds' : metric === 'dps' ? 'dps' : metric
  );

  const barChartDomain = calculateDomain(enrichedChartData, 'distance');
  const scatterPaceDomain = calculateDomain(scatterData, 'pace');
  const scatterSwolfDomain = calculateDomain(scatterData, 'swolf');

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrichedChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={barChartDomain}
            tickFormatter={(value) => `${value.toFixed(1)}km`}
          />
          <Tooltip content={<CustomTooltip metric={metric} enrichedChartData={enrichedChartData} getMilestoneType={getMilestoneType} granularity={granularity} />} />
          <Bar dataKey="distance" fill="#00d4ff" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={800} />
          <ReferenceLine
            y={stats.totalDistance / enrichedChartData.length}
            stroke="#a78bfa"
            strokeDasharray="5 5"
            label={{ value: 'Avg', position: 'right', fill: '#a78bfa' }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height="100%">
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
      </ResponsiveContainer>
    );
  }

  // Calculate swolf domain for dual axis
  const swolfDomain = calculateDomain(enrichedChartData, 'swolf');

  // Default: line chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={enrichedChartData}>
        <defs>
          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSwolf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          yAxisId="left"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={lineChartDomain}
          reversed={metric === 'pace'}
          tickFormatter={(value) => {
            if (metric === 'pace') return `${Math.floor(value / 60)}:${(value % 60).toFixed(0).padStart(2, '0')}`;
            if (metric === 'distance') return `${value.toFixed(1)}km`;
            if (metric === 'dps') return `${value.toFixed(2)}m`;
            return value.toFixed(0);
          }}
        />
        {metric === 'pace' && (
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#a78bfa"
            style={{ fontSize: '11px', opacity: 0.6 }}
            domain={swolfDomain}
            tickFormatter={(value) => value.toFixed(0)}
            label={{ value: 'SWOLF', angle: 90, position: 'insideRight', fill: '#a78bfa', opacity: 0.6 }}
          />
        )}
        <Tooltip content={<CustomTooltip metric={metric} enrichedChartData={enrichedChartData} getMilestoneType={getMilestoneType} granularity={granularity} />} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey={metric === 'pace' ? 'paceSeconds' : metric === 'dps' ? 'dps' : metric}
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
        {metric === 'pace' && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="swolf"
            stroke="#a78bfa"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            opacity={0.5}
            dot={false}
            activeDot={{ r: 5, fill: '#a78bfa', opacity: 1 }}
            isAnimationActive
            animationDuration={800}
          />
        )}
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
            dataKey={metric === 'pace' ? 'paceSeconds' : metric === 'dps' ? 'dps' : metric}
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
    </ResponsiveContainer>
  );
};
