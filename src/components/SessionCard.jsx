import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { StatGrid, ComparisonBadge, Separator } from './primitives';
import { Calendar, Activity, Zap, TrendingUp, Clock, Heart, Flame, Award } from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { ShareButton } from './sharing/ShareButton';
import { ShareModal } from './sharing/ShareModal';
import { tokens } from '../design/tokens';

export const SessionCard = memo(({ session, onClick, allSessions = [] }) => {
  const { isDark } = useTheme();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  // Calculate if this is a personal record for pace
  const isPR = allSessions.length > 0 &&
    session.pace === Math.min(...allSessions.filter(s => s.pace > 0).map(s => s.pace));

  // Calculate pace comparison (fast/average/slow)
  const avgPace = allSessions.length > 0
    ? allSessions.filter(s => s.pace > 0).reduce((sum, s) => sum + s.pace, 0) / allSessions.filter(s => s.pace > 0).length
    : null;

  const paceComparison = avgPace ? (
    session.pace < avgPace * 0.95 ? 'fast' :
    session.pace > avgPace * 1.05 ? 'slow' :
    'average'
  ) : null;

  return (
    <motion.div
      className={`transition-all ${tokens.animation.slow} ease-in-out`}
    >
      <Card
        hover={true}
        className={`cursor-pointer overflow-hidden hover:!transform-none border border-dark-border/30 ${
          session.rating === true ? 'ring-2 ring-accent-blue/30' :
          session.rating === false ? 'ring-2 ring-accent-coral/30' : ''
        }`}
        onClick={() => onClick && onClick(session)}
      >
        {/* Header with Date and Rating */}
        <div className={`flex items-start justify-between ${tokens.margin.group}`}>
          <div className="flex-1">
            <div className={`flex items-center ${tokens.gap.tight} text-content-secondary ${tokens.typography.sizes.xs} ${tokens.margin.element}`}>
              <Calendar className={tokens.icons.xs} />
              <span className={tokens.typography.weights.medium}>{formatDate(session.date)}</span>
              <span className="text-content-tertiary">•</span>
              <Clock className={tokens.icons.xs} />
              <span>{formatTime(session.date)}</span>
            </div>
            <div className={`flex items-baseline ${tokens.gap.tight}`}>
              <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} ${
                isDark
                  ? 'bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent'
                  : 'text-primary-600'
              }`}>
                {formatDistance(session.distance)}
              </h3>
              <span className={`text-content-tertiary ${tokens.typography.sizes.sm}`}>
                ({Math.round(session.distance / 25)} lengths)
              </span>
              {isPR && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className={`flex items-center ${tokens.gap.tight} px-2 py-1 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 ${tokens.radius.full} ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/20`}
                >
                  <Award className={tokens.icons.sm} />
                  <span className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.bold} text-yellow-400`}>PR</span>
                </motion.div>
              )}
            </div>
          </div>
          <ShareButton
            onClick={(e) => {
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            variant="minimal"
            size="sm"
          />
        </div>

        {/* Metrics Grid - Using StatGrid primitive */}
        <StatGrid
          stats={[
            {
              icon: Activity,
              label: 'Pace',
              value: formatPace(session.pace),
              unit: 'min/100m',
              variant: 'blue',
              badge: paceComparison && (
                <ComparisonBadge
                  comparison={paceComparison}
                  tooltip={
                    paceComparison === 'fast'
                      ? "This pace is faster than your recent average - great work! Your average time to swim 100m. Lower is faster. Most recreational swimmers range from 2:00-3:30 per 100m."
                      : "This pace is slower than your recent average. Could be a recovery swim or just an off day! Your average time to swim 100m. Most recreational swimmers range from 2:00-3:30 per 100m."
                  }
                />
              )
            },
            {
              icon: Clock,
              label: 'Duration',
              value: formatDuration(session.duration),
              unit: 'min:sec',
              variant: 'blue'
            },
            ...(session.calories > 0 ? [{
              icon: Flame,
              label: 'Calories',
              value: session.calories,
              unit: 'burned',
              variant: 'blue'
            }] : []),
            ...(session.vo2max ? [{
              icon: Heart,
              label: 'VO2 Max',
              value: session.vo2max,
              unit: 'ml/kg/min',
              variant: 'blue'
            }] : []),
            ...(session.swolf > 0 && !session.vo2max ? [{
              icon: Zap,
              label: 'SWOLF',
              value: session.swolf,
              unit: 'efficiency',
              variant: 'blue'
            }] : []),
            ...(session.swolf === 0 && session.strokes > 0 && !session.vo2max ? [{
              icon: TrendingUp,
              label: 'Strokes',
              value: session.strokes,
              unit: 'total',
              variant: 'blue'
            }] : [])
          ]}
          columns={4}
        />

        {/* Lap count footer */}
        {session.laps && session.laps.length > 0 && (
          <>
            <Separator spacing="sm" />
            <p className={`${tokens.typography.sizes.xs} text-content-secondary flex items-center ${tokens.gap.tight}`}>
              <div className={`w-1 h-1 ${tokens.radius.full} bg-primary-400 animate-pulse`} />
              {session.laps.length} length{session.laps.length !== 1 ? 's' : ''} recorded
            </p>
          </>
        )}
      </Card>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        swim={session}
        type="swim"
      />
    </motion.div>
  );
});
