import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { tokens } from '../design/tokens';

/**
 * A month's worth of swims.
 *
 * One card surface. The header sits on it and the rows sit flush on it, separated by
 * hairline rules — no inner well, so no card-inside-a-card.
 *
 * The previous version wrapped children in a `bg-dark-bg` well — the page background
 * punched into a card — which made every child card float on a slab instead of reading
 * as a row belonging to the month.
 */
export const MonthGroup = ({
  monthData,
  children,
  previousMonthStats = null,
  allCollapsed = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { monthName, stats } = monthData;

  useEffect(() => {
    setIsExpanded(!allCollapsed);
  }, [allCollapsed]);

  const formatPace = (pace) => {
    if (!pace || pace === 0) return 'N/A';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const distanceTrend = (() => {
    const previous = previousMonthStats?.totalDistance;
    if (!previous) return null;
    const change = ((stats.totalDistance - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(0),
      isImproving: change > 0,
      isNegative: change < 0,
    };
  })();

  const summaryLine = (
    <>
      {stats.totalSwims} swim{stats.totalSwims !== 1 ? 's' : ''}
      {' · '}
      {(stats.totalDistance / 1000).toFixed(1)} km
      {' · '}
      {Math.round(stats.totalDuration)} min
    </>
  );

  const trendPill = distanceTrend && (
    <span
      className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.medium} tabular-nums ${
        distanceTrend.isImproving ? tokens.typography.semantic.success : tokens.typography.semantic.danger
      }`}
    >
      {distanceTrend.isNegative ? '↓' : '↑'} {distanceTrend.value}%
    </span>
  );

  const highlights = (stats.bestPace || stats.longestSwim) && (
    <div className={`flex flex-wrap ${tokens.gap.tight} mt-3`}>
      {stats.bestPace && (
        <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
          Best pace{' '}
          <span className={`${tokens.typography.weights.semibold} text-accent-blue tabular-nums`}>
            {formatPace(stats.bestPace.pace)}
          </span>
        </span>
      )}
      {stats.bestPace && stats.longestSwim && (
        <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>·</span>
      )}
      {stats.longestSwim && (
        <span className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
          Longest{' '}
          <span className={`${tokens.typography.weights.semibold} text-primary-400 tabular-nums`}>
            {(stats.longestSwim.distance / 1000).toFixed(2)} km
          </span>
        </span>
      )}
    </div>
  );

  // One real button for the whole header — the old version was a div with onClick
  // wrapping a second button, which nested interactive elements and split the hit target.
  const header = (
    <button
      type="button"
      onClick={() => setIsExpanded(!isExpanded)}
      aria-expanded={isExpanded}
      className={`w-full text-left sticky top-0 ${tokens.zIndex.sticky} bg-dark-card ${tokens.padding.default} ${tokens.components.states.focus}`}
    >
      <div className={`flex items-start justify-between ${tokens.gap.compact}`}>
        <div className={`flex items-start ${tokens.gap.tight} min-w-0`}>
          <ChevronDown
            className={`${tokens.icons.md} text-content-tertiary flex-shrink-0 mt-1 transition-transform ${tokens.animation.default} ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
          <div className="min-w-0">
            <h2
              className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} leading-tight`}
            >
              {monthName}
            </h2>
            <p className={`${tokens.typography.sizes.sm} text-content-tertiary mt-0.5`}>
              {summaryLine}
            </p>
            {isExpanded && highlights}
          </div>
        </div>

        <div className={`hidden sm:flex items-center ${tokens.gap.tight} flex-shrink-0 pt-1`}>
          <TrendingUp className={`${tokens.icons.xs} text-content-tertiary`} />
          <span
            className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} tabular-nums`}
          >
            {(stats.totalDistance / 1000).toFixed(1)} km
          </span>
          {trendPill}
        </div>
      </div>
    </button>
  );

  const body = (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Rows sit flush on the month surface, separated by rules that run edge
              to edge. No background, no padding well. */}
          <div className="divide-y divide-dark-border/20 border-t border-dark-border/20">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className={`bg-dark-card ${tokens.radius.md} overflow-hidden`}>
      {header}
      {body}
    </section>
  );
};
