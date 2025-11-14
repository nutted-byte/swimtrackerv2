import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Minus, BarChart2, ArrowRight } from 'lucide-react';
import { CardVariant } from '../primitives';
import { getCurrentWeekStats, getLastWeekStats, getWeeklyTrend, getWeeklyDayBreakdown } from '../../utils/weeklyStats';
import { formatDuration } from '../../utils/formatters';

export const WeeklySummaryCard = ({ sessions }) => {
  const currentWeek = useMemo(() => getCurrentWeekStats(sessions), [sessions]);
  const lastWeek = useMemo(() => getLastWeekStats(sessions), [sessions]);
  const trend = useMemo(() => getWeeklyTrend(currentWeek, lastWeek), [currentWeek, lastWeek]);
  const dayBreakdown = useMemo(() => getWeeklyDayBreakdown(sessions), [sessions]);

  // Format pace for display
  const formatPace = (pace) => {
    if (!pace || pace <= 0) return '--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get trend icon and color
  const getTrendDisplay = (trendData) => {
    switch (trendData.trend) {
      case 'up':
        return { Icon: TrendingUp, color: 'text-green-400' };
      case 'down':
        return { Icon: TrendingDown, color: 'text-red-400' };
      default:
        return { Icon: Minus, color: 'text-content-tertiary' };
    }
  };

  const { Icon: DistanceTrendIcon, color: distanceTrendColor } = getTrendDisplay(trend.distance);
  const { Icon: PaceTrendIcon, color: paceTrendColor } = getTrendDisplay(trend.pace);

  // Calculate max count for bar chart scaling
  const maxCount = Math.max(...dayBreakdown.map(d => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <CardVariant variant="primary" className="h-full">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className={`${tokens.icons.sm} text-accent-blue`} />
          <span className="text-sm font-medium text-content-secondary">
            This Week
          </span>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Sessions Count */}
          <div className="bg-dark-bg/30 rounded-lg p-3">
            <div className="text-xs text-content-tertiary mb-1">Sessions</div>
            <div className="flex items-baseline gap-2">
              <span className={`${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>{currentWeek.count}</span>
              {trend.count.trend !== 'steady' && (
                <div className={`flex items-center gap-1 text-xs ${trend.count.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.count.change > 0 ? '+' : ''}{trend.count.change}%
                </div>
              )}
            </div>
          </div>

          {/* Days Active */}
          <div className="bg-dark-bg/30 rounded-lg p-3">
            <div className="text-xs text-content-tertiary mb-1">Days Active</div>
            <div className="flex items-baseline gap-2">
              <span className={`${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>{currentWeek.daysActive}/7</span>
            </div>
          </div>

          {/* Total Distance */}
          <div className="bg-dark-bg/30 rounded-lg p-3">
            <div className="text-xs text-content-tertiary mb-1">Distance</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {(currentWeek.totalDistance / 1000).toFixed(1)}km
              </span>
              {trend.distance.trend !== 'steady' && (
                <DistanceTrendIcon className={`${tokens.icons.sm} ${distanceTrendColor}`} />
              )}
            </div>
            {trend.distance.change !== 0 && (
              <div className={`text-xs ${distanceTrendColor} mt-1`}>
                {trend.distance.change > 0 ? '+' : ''}{trend.distance.change}% vs last week
              </div>
            )}
          </div>

          {/* Average Pace */}
          <div className="bg-dark-bg/30 rounded-lg p-3">
            <div className="text-xs text-content-tertiary mb-1">Avg Pace</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {currentWeek.avgPace > 0 ? formatPace(currentWeek.avgPace) : '--'}
              </span>
              {trend.pace.trend !== 'steady' && currentWeek.avgPace > 0 && (
                <PaceTrendIcon className={`${tokens.icons.sm} ${paceTrendColor}`} />
              )}
            </div>
            {trend.pace.change !== 0 && currentWeek.avgPace > 0 && (
              <div className={`text-xs ${paceTrendColor} mt-1`}>
                {trend.pace.change > 0 ? '+' : ''}{Math.abs(trend.pace.change)}% {trend.pace.change > 0 ? 'faster' : 'slower'}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className={`${tokens.icons.xs} text-accent-blue`} />
            <span className="text-xs text-content-tertiary">Daily Activity</span>
          </div>
          <div className="flex items-end justify-between gap-1 h-16">
            {dayBreakdown.map((day, index) => {
              const today = new Date().toDateString();
              const isToday = day.date === today;
              const barHeight = day.count > 0 ? (day.count / maxCount) * 100 : 5;

              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`w-full rounded-t ${
                      day.hasActivity
                        ? isToday
                          ? 'bg-blue-500'
                          : 'bg-blue-400/70'
                        : 'bg-dark-bg'
                    } ${isToday ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-dark-card' : ''}`}
                    style={{ minHeight: '4px' }}
                  />
                  <span className={`${tokens.typography.sizes.xs} ${isToday ? 'text-accent-blue font-semibold' : 'text-content-tertiary'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Message */}
        {currentWeek.count > 0 ? (
          <div className="mb-4 p-2 bg-dark-bg/20 rounded text-xs text-content-secondary text-center">
            {currentWeek.count === 1 ? (
              <span>✓ Swam this week! Keeping the streak alive.</span>
            ) : currentWeek.count >= 2 ? (
              <span>Extra swim this week! Bonus distance logged. 🎉</span>
            ) : (
              <span>Great week! Consistency is the key to improvement.</span>
            )}
          </div>
        ) : (
          <div className="mb-4 p-2 bg-dark-bg/20 rounded text-xs text-content-secondary text-center">
            No swim yet this week. Schedule one to keep your streak!
          </div>
        )}

        <Link
          to="/swims"
          className={`${tokens.typography.sizes.xs} text-accent-blue hover:text-primary-300 flex items-center justify-center gap-1 group transition-colors`}
        >
          View all sessions
          <ArrowRight className={`${tokens.icons.xs} group-hover:translate-x-1 transition-transform`} />
        </Link>
      </CardVariant>
    </motion.div>
  );
};
