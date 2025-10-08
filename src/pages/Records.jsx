import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { Trophy, Zap, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Records = () => {
  const navigate = useNavigate();
  const { sessions } = useSwimData();

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="font-display text-4xl font-bold mb-4">
            No Records Yet
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Upload some swims to start tracking your personal bests!
          </p>
          <Link to="/upload" className="btn-primary">
            Upload Swim Data
          </Link>
        </motion.div>
      </div>
    );
  }

  // Find records
  const records = {
    fastestPace: sessions
      .filter(s => s.pace > 0)
      .reduce((best, s) => !best || s.pace < best.pace ? s : best, null),

    longestDistance: sessions
      .reduce((best, s) => !best || s.distance > best.distance ? s : best, null),

    bestSwolf: sessions
      .filter(s => s.swolf > 0)
      .reduce((best, s) => !best || s.swolf < best.swolf ? s : best, null),

    mostStrokes: sessions
      .filter(s => s.strokes > 0)
      .reduce((best, s) => !best || s.strokes > best.strokes ? s : best, null),

    longestDuration: sessions
      .reduce((best, s) => !best || s.duration > best.duration ? s : best, null),
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const RecordCard = ({ title, value, unit, subtitle, icon: Icon, session, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-accent-blue/20 to-accent-blue/5 border-accent-blue/30',
      coral: 'from-accent-coral/20 to-accent-coral/5 border-accent-coral/30',
      teal: 'from-primary-500/20 to-primary-500/5 border-primary-500/30',
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`bg-gradient-to-br ${colorClasses[color]} cursor-pointer`}
          onClick={() => session && navigate(`/session/${session.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-dark-bg/50">
              <Icon className="w-8 h-8 text-accent-blue" />
            </div>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>

          <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-4xl font-bold">{value}</span>
            {unit && <span className="text-lg text-gray-400">{unit}</span>}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
          )}

          {session && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-dark-border">
              <Calendar className="w-3 h-3" />
              {formatDate(session.date)}
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Calculate some fun stats
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalStrokes = sessions.reduce((sum, s) => sum + s.strokes, 0);
  const avgPace = sessions.filter(s => s.pace > 0).reduce((sum, s) => sum + s.pace, 0) / sessions.filter(s => s.pace > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="font-display text-5xl font-bold mb-2">
            Personal Records
          </h1>
          <p className="text-xl text-gray-400">
            Your best performances across {sessions.length} swims
          </p>
        </div>

        {/* Main Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {records.fastestPace && (
            <RecordCard
              title="Fastest Pace"
              value={formatPace(records.fastestPace.pace)}
              unit="min/100m"
              subtitle={`${records.fastestPace.distance}m swim`}
              icon={Zap}
              session={records.fastestPace}
              color="blue"
            />
          )}

          {records.longestDistance && (
            <RecordCard
              title="Longest Swim"
              value={(records.longestDistance.distance / 1000).toFixed(2)}
              unit="km"
              subtitle={`${records.longestDistance.duration} minutes`}
              icon={TrendingUp}
              session={records.longestDistance}
              color="teal"
            />
          )}

          {records.bestSwolf && (
            <RecordCard
              title="Best SWOLF"
              value={records.bestSwolf.swolf}
              subtitle="Most efficient swim"
              icon={Target}
              session={records.bestSwolf}
              color="blue"
            />
          )}

          {records.longestDuration && (
            <RecordCard
              title="Longest Session"
              value={records.longestDuration.duration}
              unit="minutes"
              subtitle={`${records.longestDuration.distance}m covered`}
              icon={Award}
              session={records.longestDuration}
              color="coral"
            />
          )}

          {records.mostStrokes && (
            <RecordCard
              title="Most Strokes"
              value={records.mostStrokes.strokes}
              unit="strokes"
              subtitle={`${records.mostStrokes.distance}m swim`}
              icon={TrendingUp}
              session={records.mostStrokes}
              color="teal"
            />
          )}
        </div>

        {/* All-Time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-primary-400" />
              <h2 className="font-display text-2xl font-bold">All-Time Stats</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-dark-bg rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Total Distance</p>
                <p className="font-display text-3xl font-bold text-accent-blue">
                  {(totalDistance / 1000).toFixed(1)} km
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  That's {Math.round(totalDistance / 25)} lengths!
                </p>
              </div>

              <div className="text-center p-6 bg-dark-bg rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Total Strokes</p>
                <p className="font-display text-3xl font-bold text-primary-400">
                  {totalStrokes.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg {Math.round(totalStrokes / sessions.length)} per swim
                </p>
              </div>

              <div className="text-center p-6 bg-dark-bg rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Average Pace</p>
                <p className="font-display text-3xl font-bold text-accent-blue">
                  {formatPace(avgPace)}
                </p>
                <p className="text-xs text-gray-500 mt-1">min/100m overall</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Click to view hint */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Click on any record to view the full session details
        </p>
      </motion.div>
    </div>
  );
};
