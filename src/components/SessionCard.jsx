import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { StatGrid, ComparisonBadge, Separator } from './primitives';
import { Calendar, Activity, Clock, Award } from 'lucide-react';
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
        className={`cursor-pointer overflow-hidden hover:!transform-none border border-dark-border/30 p-3 md:p-6 ${
          session.rating === true ? 'ring-2 ring-accent-blue/30' :
          session.rating === false ? 'ring-2 ring-accent-coral/30' : ''
        }`}
        onClick={() => onClick && onClick(session)}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-content-secondary text-xs">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{formatDate(session.date)}</span>
            <span className="text-content-tertiary">•</span>
            <span>{formatTime(session.date)}</span>
            {isPR && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-full ring-1 ring-yellow-400/50">
                <Award className="w-3 h-3" />
                <span className="text-[10px] font-bold text-yellow-400">PR</span>
              </div>
            )}
          </div>
          <ShareButton
            onClick={(e) => {
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            variant="minimal"
            size="sm"
            className="hidden md:flex"
          />
        </div>

        {/* Compact Metrics Row */}
        <div className="flex items-start gap-6">
          {/* Distance */}
          <div className="flex-shrink-0">
            <h3 className={`${tokens.typography.families.display} text-xl md:text-2xl font-bold leading-none ${
              isDark
                ? 'bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent'
                : 'text-primary-600'
            }`}>
              {formatDistance(session.distance)}
            </h3>
            <div className="text-[10px] text-content-tertiary mt-0.5">
              {Math.round(session.distance / 25)} lengths
            </div>
          </div>

          {/* Pace */}
          <div className="flex items-start gap-2">
            <Activity className="w-4 h-4 text-content-tertiary mt-1" />
            <div>
              <span className="text-xl md:text-2xl font-bold leading-none">{formatPace(session.pace)}</span>
              <div className="text-[10px] text-content-tertiary mt-0.5">min/100m</div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-content-tertiary mt-1" />
            <div>
              <span className="text-xl md:text-2xl font-bold leading-none">{formatDuration(session.duration)}</span>
              <div className="text-[10px] text-content-tertiary mt-0.5">duration</div>
            </div>
          </div>
        </div>
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
