import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';
import { tokens } from '../../design/tokens';

/**
 * RecentSwimsTrend - Mini sparkline for Recent Swims section
 * Shows pace trend over last 10 swims with trend indicator
 */
export const RecentSwimsTrend = ({ sessions }) => {
  const analysis = useMemo(() => {
    if (sessions.length < 2) {
      return null; // Don't show if insufficient data
    }

    // Take up to 10 sessions for the chart
    const recentSessions = sessions.slice(0, Math.min(10, sessions.length));
    const sparklineData = [...recentSessions].reverse().map((s, index) => ({
      index,
      pace: s.pace,
      paceSeconds: s.pace * 60
    }));

    // Calculate trend (comparing recent 3 vs older 3)
    if (recentSessions.length < 4) {
      return {
        data: sparklineData,
        trend: 'stable',
        percentChange: 0
      };
    }

    const avgRecent = recentSessions.slice(0, 3).reduce((sum, s) => sum + s.pace, 0) / 3;
    const avgOlder = recentSessions.slice(-3).reduce((sum, s) => sum + s.pace, 0) / 3;
    const percentChange = ((avgOlder - avgRecent) / avgOlder * 100);
    const isImproving = avgRecent < avgOlder; // Lower pace is better
    const isStable = Math.abs(percentChange) < 2;

    // Calculate average pace across all sessions
    const avgPace = recentSessions.reduce((sum, s) => sum + s.pace, 0) / recentSessions.length;
    const avgPaceSeconds = avgPace * 60;

    return {
      data: sparklineData,
      trend: isStable ? 'stable' : isImproving ? 'improving' : 'declining',
      percentChange: Math.abs(percentChange),
      avgPaceSeconds,
      avgPace
    };
  }, [sessions]);

  // Don't render if insufficient data
  if (!analysis) {
    return null;
  }

  const getTrendIcon = () => {
    if (analysis.trend === 'improving') return TrendingUp;
    if (analysis.trend === 'declining') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (analysis.trend === 'improving') return 'text-green-400';
    if (analysis.trend === 'declining') return 'text-orange-400';
    return 'text-content-tertiary';
  };

  const getTrendText = () => {
    if (analysis.trend === 'improving') return 'Pace improving';
    if (analysis.trend === 'declining') return 'Pace slowing';
    return 'Pace stable';
  };

  const TrendIcon = getTrendIcon();

  // Format pace for display (decimal minutes to min:sec)
  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate dynamic Y-axis domain to zoom into variation
  const { domain, strokeColor, gradientId } = useMemo(() => {
    const paceValues = analysis.data.map(d => d.paceSeconds);
    const minPace = Math.min(...paceValues);
    const maxPace = Math.max(...paceValues);
    const range = maxPace - minPace;

    // Add 30% padding, minimum 10 seconds
    const padding = Math.max(range * 0.3, 10);

    // Always use blue/primary color
    const color = CHART_COLORS.PRIMARY;

    const id = `recentSwimsTrendGradient_${analysis.trend}`;

    return {
      domain: [minPace - padding, maxPace + padding],
      strokeColor: color,
      gradientId: id
    };
  }, [analysis.data, analysis.trend]);

  return (
    <div className="mb-4">
      {/* Trend indicator */}
      <div className="flex items-center gap-2 mb-2">
        <p className="text-content-tertiary text-sm">Last 3 months</p>
        <span className="text-content-tertiary">•</span>
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          <TrendIcon className={tokens.icons.xs} />
          <span>{getTrendText()}</span>
          {analysis.trend !== 'stable' && (
            <span className="font-medium">
              {analysis.percentChange.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Sparkline chart with pace labels */}
      <div className="relative">
        {/* Pace indicators */}
        <div className="flex justify-between text-xs text-primary-400 mb-1 font-medium">
          <span>{formatPace(analysis.data[0].pace)}</span>
          <span>{formatPace(analysis.data[analysis.data.length - 1].pace)}</span>
        </div>

        {/* Chart */}
        <div className="h-20 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analysis.data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={domain} hide reversed />
              <ReferenceLine
                y={analysis.avgPaceSeconds}
                stroke="#64748b"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="paceSeconds"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
                isAnimationActive
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
