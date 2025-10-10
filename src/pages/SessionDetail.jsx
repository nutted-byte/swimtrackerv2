import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import {
  ArrowLeft,
  Calendar,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';

export const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions } = useSwimData();

  const backPath = location.state?.from || '/sessions';
  const backLabel = location.state?.label || 'Sessions';

  const session = sessions.find(s => s.id === id);

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">
          Session Not Found
        </h1>
        <Link to="/sessions" className="btn-primary">
          Back to Sessions
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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

  // Calculate lap statistics
  const lapStats = session.laps && session.laps.length > 0 ? {
    fastest: session.laps.reduce((min, lap) =>
      lap.avgPace > 0 && (min.avgPace === 0 || lap.avgPace < min.avgPace) ? lap : min
    , session.laps[0]),
    slowest: session.laps.reduce((max, lap) =>
      lap.avgPace > max.avgPace ? lap : max
    , session.laps[0]),
    avgDistance: session.laps.reduce((sum, lap) => sum + lap.distance, 0) / session.laps.length
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {backLabel}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(session.date)}</span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-2">
            {formatDistance(session.distance)}
          </h1>
          <p className="text-xl text-gray-400">
            {session.sport || 'Swimming'} Session
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Pace"
            value={formatPace(session.pace)}
            unit="min/100m"
            icon={Activity}
          />
          <StatCard
            label="Duration"
            value={session.duration}
            unit="minutes"
            icon={Clock}
          />
          {session.swolf > 0 && (
            <StatCard
              label="SWOLF"
              value={session.swolf}
              icon={Zap}
            />
          )}
          {session.strokes > 0 && (
            <StatCard
              label="Total Strokes"
              value={session.strokes}
              icon={TrendingUp}
            />
          )}
        </div>

        {/* Lap-by-Lap Breakdown */}
        {session.laps && session.laps.length > 0 && (
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-6 h-6 text-primary-400" />
              <h2 className="font-display text-2xl font-bold">
                Lap-by-Lap Analysis
              </h2>
            </div>

            {lapStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-dark-bg rounded-lg">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Fastest Lap</p>
                  <p className="font-display text-lg font-semibold">
                    Lap {lapStats.fastest.number} • {formatPace(lapStats.fastest.avgPace)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Slowest Lap</p>
                  <p className="font-display text-lg font-semibold">
                    Lap {lapStats.slowest.number} • {formatPace(lapStats.slowest.avgPace)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Lap Distance</p>
                  <p className="font-display text-lg font-semibold">
                    {Math.round(lapStats.avgDistance)} m
                  </p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Lap</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Distance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pace</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Strokes</th>
                  </tr>
                </thead>
                <tbody>
                  {session.laps.map((lap) => (
                    <motion.tr
                      key={lap.number}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: lap.number * 0.02 }}
                      className={`border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors ${
                        lapStats && lap.number === lapStats.fastest.number ? 'bg-accent-blue/5' :
                        lapStats && lap.number === lapStats.slowest.number ? 'bg-accent-coral/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {lap.number}
                        {lapStats && lap.number === lapStats.fastest.number && (
                          <span className="ml-2 text-xs text-accent-blue">⚡</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{lap.distance} m</td>
                      <td className="py-3 px-4">{Math.round(lap.duration)} s</td>
                      <td className="py-3 px-4 font-display font-semibold">
                        {formatPace(lap.avgPace)}
                      </td>
                      <td className="py-3 px-4">{lap.strokes || '-'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Session Metadata */}
        <Card>
          <h3 className="font-display text-xl font-semibold mb-4">
            Session Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">File Name:</span>
              <span className="ml-2 text-gray-200">{session.fileName || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-gray-400">Session ID:</span>
              <span className="ml-2 text-gray-200 font-mono text-xs">{session.id}</span>
            </div>
            <div>
              <span className="text-gray-400">Sport:</span>
              <span className="ml-2 text-gray-200">{session.sport || 'Swimming'}</span>
            </div>
            {session.laps && (
              <div>
                <span className="text-gray-400">Total Laps:</span>
                <span className="ml-2 text-gray-200">{session.laps.length}</span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
