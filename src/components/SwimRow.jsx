import { memo } from 'react';
import { Award, ChevronRight, Trash2 } from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import { tokens } from '../design/tokens';

/**
 * A single swim inside a month group.
 *
 * Deliberately NOT a <Card>. The grouped view previously nested a full SessionCard
 * inside the month container, which put a card surface inside a well inside a card —
 * boxes within boxes. This row carries no surface of its own: the month group owns the
 * one surface, and rows sit flush on it separated by hairline rules.
 *
 * Navigation and delete are SIBLING buttons, never nested. The old card made the whole
 * card clickable and dropped an absolutely-positioned delete button on top of it, which
 * nested interactive elements and left the row unreachable by keyboard.
 */

// Rating maps to the ocean semantic palette (kelp / amber-tide / coral) rather than the
// stock green-500/yellow-500/red-500 the old cards used, which predate the editorial
// design overhaul.
const RATING_BARS = {
  good: 'bg-kelp-400',
  average: 'bg-amber-tide-400',
  bad: 'bg-coral-400',
};

const formatPace = (pace) => {
  if (!pace || pace <= 0) return '—';
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${meters} m`;
};

export const SwimRow = memo(({ session, onClick, onDelete, isPR = false }) => {
  const date = new Date(session.date);
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const ratingBar = RATING_BARS[session.rating] || null;
  const readableDate = date.toLocaleDateString('en-US', { dateStyle: 'medium' });

  return (
    <div className={`relative group/row flex items-center hover:bg-dark-bg/40 transition-colors ${tokens.animation.default}`}>
      {/* Rating as a left accent bar rather than a border box around the whole row */}
      {ratingBar && (
        <span className={`absolute left-0 top-0 bottom-0 w-0.5 ${ratingBar}`} aria-hidden="true" />
      )}

      {/* Navigation — a real button covering everything except the delete control */}
      <button
        type="button"
        onClick={() => onClick && onClick(session)}
        aria-label={`View swim from ${readableDate}`}
        className={`flex-1 min-w-0 flex items-center ${tokens.gap.compact} text-left py-3 pl-5 ${tokens.components.states.focus}`}
      >
        {/* Fixed-width gutter so every row's metrics start at the same x */}
        <div className="w-12 flex-shrink-0">
          <div className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.bold} leading-none tabular-nums text-content`}>
            {day}
          </div>
          <div className={`${tokens.typography.sizes.xs} text-content-tertiary mt-0.5`}>
            {weekday}
          </div>
        </div>

        {/* tabular-nums keeps the columns aligned down the whole month, so a single
            column can be scanned vertically to compare swims. */}
        <div className={`flex-1 min-w-0 flex flex-wrap items-baseline ${tokens.gap.compact}`}>
          <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.base} ${tokens.typography.weights.semibold} tabular-nums text-content`}>
            {formatDistance(session.distance)}
          </span>
          <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.base} tabular-nums text-content-secondary`}>
            {formatPace(session.pace)}
            <span className={`${tokens.typography.sizes.xs} text-content-tertiary ml-1`}>/100m</span>
          </span>
          <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.base} tabular-nums text-content-secondary`}>
            {formatDuration(session.duration)}
          </span>
          {isPR && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${tokens.radius.full} bg-amber-tide-400/15 ring-1 ring-amber-tide-400/40`}
              title="Fastest pace of all time"
            >
              <Award className={`${tokens.icons.xs} text-amber-tide-300`} />
              <span className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.bold} text-amber-tide-300`}>
                PR
              </span>
            </span>
          )}
        </div>
      </button>

      {/* Sibling of the nav button, not nested inside it */}
      <button
        type="button"
        onClick={(e) => onDelete(session.id, e)}
        aria-label={`Delete swim from ${readableDate}`}
        className={`p-2 ${tokens.radius.sm} text-content-tertiary hover:text-coral-400 hover:bg-coral-400/10 opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity ${tokens.components.states.focus}`}
      >
        <Trash2 className={tokens.icons.sm} />
      </button>

      <ChevronRight
        className={`${tokens.icons.sm} text-content-tertiary flex-shrink-0 mr-3`}
        aria-hidden="true"
      />
    </div>
  );
});

SwimRow.displayName = 'SwimRow';
