import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Activity, TrendingUp, Zap, Calendar } from 'lucide-react';
import { Card } from './Card';

export const MonthGroup = ({ monthData, children, previousMonthStats = null, allCollapsed = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { monthName, stats } = monthData;

  // Update expanded state when allCollapsed changes
  useEffect(() => {
    setIsExpanded(!allCollapsed);
  }, [allCollapsed]);

  const formatPace = (pace) => {
    if (!pace || pace === 0) return 'N/A';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate month-over-month trends
  const calculateTrend = (current, previous, lowerIsBetter = false) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    const isImproving = lowerIsBetter ? change < 0 : change > 0;
    return {
      value: Math.abs(change).toFixed(1),
      isImproving,
      isNegative: change < 0
    };
  };

  const paceTrend = previousMonthStats?.avgPace
    ? calculateTrend(stats.avgPace, previousMonthStats.avgPace, true)
    : null;

  const distanceTrend = previousMonthStats?.totalDistance
    ? calculateTrend(stats.totalDistance, previousMonthStats.totalDistance)
    : null;

  return (
    <div className="mb-6">
      {/* Month Header */}
      <div
        className="sticky top-0 z-10 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border mb-4 -mx-4 px-4 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-dark-card rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                {monthName}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {stats.totalSwims} swim{stats.totalSwims !== 1 ? 's' : ''} •{' '}
                {(stats.totalDistance / 1000).toFixed(1)} km •{' '}
                {Math.round(stats.totalDuration)} minutes
              </p>
            </div>
          </div>

          {/* Month Stats Summary */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Activity className="w-3 h-3" />
                <span>Avg Pace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-semibold">
                  {formatPace(stats.avgPace)}
                </span>
                {paceTrend && (
                  <span
                    className={`text-xs ${
                      paceTrend.isImproving ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {paceTrend.isNegative ? '↓' : '↑'} {paceTrend.value}%
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Total Distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-semibold">
                  {(stats.totalDistance / 1000).toFixed(1)} km
                </span>
                {distanceTrend && (
                  <span
                    className={`text-xs ${
                      distanceTrend.isImproving ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {distanceTrend.isNegative ? '↓' : '↑'} {distanceTrend.value}%
                  </span>
                )}
              </div>
            </div>

            {stats.avgSwolf > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Zap className="w-3 h-3" />
                  <span>Avg SWOLF</span>
                </div>
                <span className="font-display text-lg font-semibold">
                  {Math.round(stats.avgSwolf)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Stats */}
        {isExpanded && (
          <div className="md:hidden mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Activity className="w-3 h-3" />
                <span>Avg Pace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold">
                  {formatPace(stats.avgPace)}
                </span>
                {paceTrend && (
                  <span
                    className={`text-xs ${
                      paceTrend.isImproving ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {paceTrend.isNegative ? '↓' : '↑'} {paceTrend.value}%
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Total Distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold">
                  {(stats.totalDistance / 1000).toFixed(1)} km
                </span>
                {distanceTrend && (
                  <span
                    className={`text-xs ${
                      distanceTrend.isImproving ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {distanceTrend.isNegative ? '↓' : '↑'} {distanceTrend.value}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Best Performance Highlights */}
        {isExpanded && (stats.bestPace || stats.longestSwim) && (
          <div className="mt-4 pt-4 border-t border-dark-border/50">
            <div className="flex flex-wrap gap-3">
              {stats.bestPace && (
                <div className="px-3 py-2 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Best Pace</p>
                  <p className="text-sm font-semibold text-accent-blue">
                    {formatPace(stats.bestPace.pace)} on{' '}
                    {new Date(stats.bestPace.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {stats.longestSwim && (
                <div className="px-3 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Longest Swim</p>
                  <p className="text-sm font-semibold text-primary-400">
                    {(stats.longestSwim.distance / 1000).toFixed(2)} km on{' '}
                    {new Date(stats.longestSwim.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sessions Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
