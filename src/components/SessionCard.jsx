import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Tooltip } from './Tooltip';
import { Calendar, Activity, Zap, TrendingUp, Clock, Heart, Waves, Flame, Award, TrendingDown } from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export const SessionCard = memo(({ session, onClick, allSessions = [] }) => {
  const { isDark } = useTheme();

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="transition-all duration-300 ease-in-out"
    >
      <Card
        hover={true}
        className={`cursor-pointer overflow-hidden ${
          session.rating === true ? 'ring-2 ring-accent-blue/30' :
          session.rating === false ? 'ring-2 ring-accent-coral/30' : ''
        }`}
        onClick={() => onClick && onClick(session)}
      >
        {/* Header with Date and Rating */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-content-secondary text-xs mb-1.5">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">{formatDate(session.date)}</span>
              <span className="text-gray-600">•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(session.date)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`font-display text-3xl font-bold ${
                isDark
                  ? 'bg-gradient-to-r from-primary-400 to-accent-blue bg-clip-text text-transparent'
                  : 'text-primary-600'
              }`}>
                {formatDistance(session.distance)}
              </h3>
              <span className="text-content-tertiary text-sm">
                ({Math.round(session.distance / 25)} lengths)
              </span>
              {isPR && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-full ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/20"
                >
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">PR</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          {/* Pace */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.05, y: -2 }}
            className="relative bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg p-3 border border-accent-blue/20 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/0 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="p-1 bg-accent-blue/20 rounded">
                  <Activity className="w-3.5 h-3.5 text-accent-blue" />
                </div>
                <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">Pace</span>
                {paceComparison === 'fast' && (
                  <Tooltip content="This pace is faster than your recent average - great work! Your average time to swim 100m. Lower is faster. Most recreational swimmers range from 2:00-3:30 per 100m." icon={true}>
                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded font-medium">
                      <TrendingUp className="w-2.5 h-2.5" />
                      Fast
                    </span>
                  </Tooltip>
                )}
                {paceComparison === 'slow' && (
                  <Tooltip content="This pace is slower than your recent average. Could be a recovery swim or just an off day! Your average time to swim 100m. Most recreational swimmers range from 2:00-3:30 per 100m." icon={true}>
                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-medium">
                      <TrendingDown className="w-2.5 h-2.5" />
                      Easy
                    </span>
                  </Tooltip>
                )}
              </div>
              <p className="font-display text-xl font-bold text-content tabular-nums">
                {formatPace(session.pace)}
              </p>
              <p className="text-[10px] text-content-tertiary mt-0.5">min/100m</p>
            </div>
          </motion.div>

          {/* Duration */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.05, y: -2 }}
            className="relative bg-gradient-to-br from-primary-500/10 to-primary-500/5 rounded-lg p-3 border border-primary-500/20 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="p-1 bg-primary-500/20 rounded">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                </div>
                <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">Duration</span>
              </div>
              <p className="font-display text-xl font-bold text-content tabular-nums">
                {formatDuration(session.duration)}
              </p>
              <p className="text-[10px] text-content-tertiary mt-0.5">min:sec</p>
            </div>
          </motion.div>

          {/* Calories */}
          {session.calories > 0 && (
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-lg p-3 border border-orange-500/20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 bg-orange-500/20 rounded">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">Calories</span>
                </div>
                <p className="font-display text-xl font-bold text-content tabular-nums">
                  {session.calories}
                </p>
                <p className="text-[10px] text-content-tertiary mt-0.5">burned</p>
              </div>
            </motion.div>
          )}

          {/* VO2 Max */}
          {session.vo2max && (
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-lg p-3 border border-red-500/20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 bg-red-500/20 rounded">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">VO2 Max</span>
                </div>
                <p className="font-display text-xl font-bold text-content tabular-nums">
                  {session.vo2max}
                </p>
                <p className="text-[10px] text-content-tertiary mt-0.5">ml/kg/min</p>
              </div>
            </motion.div>
          )}

          {/* SWOLF */}
          {session.swolf > 0 && !session.vo2max && (
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-3 border border-purple-500/20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 bg-purple-500/20 rounded">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">SWOLF</span>
                </div>
                <p className="font-display text-xl font-bold text-content tabular-nums">
                  {session.swolf}
                </p>
                <p className="text-[10px] text-content-tertiary mt-0.5">efficiency</p>
              </div>
            </motion.div>
          )}

          {/* Strokes */}
          {session.swolf === 0 && session.strokes > 0 && !session.vo2max && (
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-lg p-3 border border-green-500/20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 bg-green-500/20 rounded">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <span className="text-content-secondary text-[10px] font-medium uppercase tracking-wide">Strokes</span>
                </div>
                <p className="font-display text-xl font-bold text-content tabular-nums">
                  {session.strokes}
                </p>
                <p className="text-[10px] text-content-tertiary mt-0.5">total</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Lap count footer */}
        {session.laps && session.laps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dark-border/50">
            <p className="text-xs text-content-secondary flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-400 animate-pulse" />
              {session.laps.length} length{session.laps.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
});
