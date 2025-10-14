import { memo } from 'react';
import { Card } from './Card';
import { Calendar, Activity, Zap, TrendingUp, Clock, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';

export const SessionCard = memo(({ session, onClick }) => {
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

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <Card
        hover={true}
        className="cursor-pointer"
        onClick={() => onClick && onClick(session)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(session.date)}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{formatTime(session.date)}</span>
            </div>
            <h3 className="font-display text-xl font-semibold">
              {formatDistance(session.distance)}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {session.rating === true && (
              <div className="p-2 bg-accent-blue/20 rounded-lg" title="Good swim">
                <ThumbsUp className="w-4 h-4 text-accent-blue" />
              </div>
            )}
            {session.rating === false && (
              <div className="p-2 bg-accent-coral/20 rounded-lg" title="Could be better">
                <ThumbsDown className="w-4 h-4 text-accent-coral" />
              </div>
            )}
            <div className="px-3 py-1 bg-primary-500/20 rounded-full text-primary-400 text-sm font-medium">
              {session.sport || 'Swimming'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Activity className="w-3 h-3" />
              <span>Pace</span>
            </div>
            <p className="font-display text-lg font-semibold">
              {formatPace(session.pace)}
              <span className="text-sm text-gray-400 ml-1">min/100m</span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <Clock className="w-3 h-3" />
              <span>Duration</span>
            </div>
            <p className="font-display text-lg font-semibold">
              {session.duration}
              <span className="text-sm text-gray-400 ml-1">min</span>
            </p>
          </div>

          {session.vo2max && (
            <div>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                <Heart className="w-3 h-3" />
                <span>VO2 Max</span>
              </div>
              <p className="font-display text-lg font-semibold">
                {session.vo2max}
                <span className="text-sm text-gray-400 ml-1">ml/kg/min</span>
              </p>
            </div>
          )}

          {session.swolf > 0 && !session.vo2max && (
            <div>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                <Zap className="w-3 h-3" />
                <span>SWOLF</span>
              </div>
              <p className="font-display text-lg font-semibold">
                {session.swolf}
              </p>
            </div>
          )}

          {session.swolf === 0 && session.strokes > 0 && !session.vo2max && (
            <div>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Strokes</span>
              </div>
              <p className="font-display text-lg font-semibold">
                {session.strokes}
              </p>
            </div>
          )}
        </div>

        {session.laps && session.laps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-sm text-gray-400">
              {session.laps.length} lap{session.laps.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        )}
      </Card>
    </div>
  );
});
