import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export const PaceTrendCard = ({ sessions }) => {
  const analysis = useMemo(() => {
    if (sessions.length < 2) {
      return {
        data: [],
        message: 'Not enough data',
        trend: 'stable',
        percentChange: 0
      };
    }

    // Get last 30 days of sessions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30DaysSessions = sessions.filter(s =>
      new Date(s.date) >= thirtyDaysAgo
    );

    if (last30DaysSessions.length < 2) {
      return {
        data: [],
        message: 'Not enough data',
        trend: 'stable',
        percentChange: 0
      };
    }

    // Take up to 10 sessions for the chart
    const recentSessions = last30DaysSessions.slice(0, Math.min(10, last30DaysSessions.length));
    const sparklineData = recentSessions.reverse().map(s => ({
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pace: s.pace,
      paceSeconds: s.pace * 60
    }));

    // Calculate trend (comparing recent vs older swims)
    if (recentSessions.length < 4) {
      return {
        data: sparklineData,
        message: 'Your pace is stable',
        trend: 'stable',
        percentChange: 0
      };
    }

    const avgRecent = recentSessions.slice(-3).reduce((sum, s) => sum + s.pace, 0) / 3;
    const avgOlder = recentSessions.slice(0, 3).reduce((sum, s) => sum + s.pace, 0) / 3;
    const percentChange = ((avgOlder - avgRecent) / avgOlder * 100);
    const isImproving = avgRecent < avgOlder;
    const isStable = Math.abs(percentChange) < 2;

    const message = isStable
      ? 'Your pace is stable'
      : isImproving
      ? 'Your pace is improving'
      : 'Your pace is slowing';

    return {
      data: sparklineData,
      message,
      trend: isStable ? 'stable' : isImproving ? 'improving' : 'declining',
      percentChange: Math.abs(percentChange)
    };
  }, [sessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30 h-full">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent-blue" />
          <span className="text-sm font-medium text-content-secondary">
            Pace Trend
          </span>
        </div>

        {analysis.data.length > 0 ? (
          <>
            <div className="h-20 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.data}>
                  <defs>
                    <linearGradient id="paceTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="paceSeconds"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fill="url(#paceTrendGradient)"
                    dot={false}
                    isAnimationActive
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm font-medium text-content mb-1">
                {analysis.message}
              </p>
              {analysis.trend !== 'stable' && (
                <p className={`text-xs flex items-center justify-center gap-1 ${
                  analysis.trend === 'improving' ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {analysis.trend === 'improving' ?
                    <TrendingUp className="w-3 h-3" /> :
                    <TrendingDown className="w-3 h-3" />
                  }
                  {analysis.percentChange.toFixed(1)}% {analysis.trend === 'improving' ? 'faster' : 'slower'}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 mb-4">
            <p className="text-sm text-content-tertiary">
              {analysis.message}
            </p>
          </div>
        )}

        <Link
          to="/insights?metric=pace"
          className="text-xs text-accent-blue hover:text-accent-blue/80 flex items-center justify-center gap-1 group transition-colors"
        >
          Analyze Trend
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Card>
    </motion.div>
  );
};
