import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Activity, TrendingUp, Zap, Upload, Calendar, Clock, Droplets, Target, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSwimData } from '../context/SwimDataContext';
import { analyzeProgress, generateCoachingInsight } from '../utils/analytics';

export const Dashboard = () => {
  const { sessions, rateSession } = useSwimData();
  const navigate = useNavigate();

  // Analyze progress from real data
  const analysis = analyzeProgress(sessions, 30);
  const coachingInsight = generateCoachingInsight(analysis);

  const { status, message, improving, metrics } = analysis;

  // Get the most recent swim
  const lastSwim = sessions[0] || null;

  // Emoji based on status
  const statusEmoji = {
    'improving': '✅',
    'stable': '⚡',
    'declining': '⚠️',
    'no-data': '📊',
    'insufficient-data': '📈'
  };

  // If no data, show empty state
  if (status === 'no-data' || status === 'insufficient-data') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">🏊‍♂️</div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Welcome to Swim Tracker!
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {message}
          </p>
          <Link
            to="/upload"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Swim
          </Link>
        </motion.div>
      </div>
    );
  }

  // Format pace for display (convert decimal to min:sec)
  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section - "Am I Getting Better?" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="font-display text-5xl font-bold">
          Am I Getting Better?
        </h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block"
        >
          <Card
            glow={improving}
            className="inline-block px-12 py-6 text-center"
          >
            <motion.div
              animate={improving ? { y: [-5, 0, -5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 justify-center">
                <span className="text-6xl">
                  {statusEmoji[status]}
                </span>
                <div className="text-left">
                  <p className={`text-3xl font-display font-bold ${
                    improving ? 'text-accent-blue' :
                    status === 'declining' ? 'text-accent-coral' :
                    'text-gray-300'
                  }`}>
                    {status === 'improving' && "You're improving!"}
                    {status === 'stable' && "Staying consistent!"}
                    {status === 'declining' && "Let's refocus"}
                  </p>
                  <p className="text-lg text-gray-400">
                    {metrics.weightedScore > 0 ? '+' : ''}{metrics.weightedScore}% over last 30 days
                  </p>
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          {message} • {metrics.totalSwims} swims analyzed
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          label="Average Pace"
          value={formatPace(metrics.avgPace)}
          unit="min/100m"
          trend={metrics.trends.pace}
          icon={Activity}
          glow={metrics.trends.pace > 0}
        />
        <StatCard
          label="SWOLF"
          value={Math.round(metrics.avgSwolf)}
          trend={metrics.trends.swolf}
          icon={Zap}
          glow={metrics.trends.swolf > 0}
        />
        <StatCard
          label="Total Distance"
          value={(metrics.totalDistance / 1000).toFixed(1)}
          unit="km"
          trend={metrics.trends.distance}
          icon={TrendingUp}
        />
      </motion.div>

      {/* Last Swim Deep Dive */}
      {lastSwim && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-primary-500/10 to-accent-blue/5 border-primary-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">Last Swim Deep Dive</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(lastSwim.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Rating buttons */}
                <div className="flex items-center gap-1 bg-dark-bg/50 rounded-lg p-1">
                  <button
                    onClick={() => rateSession(lastSwim.id, lastSwim.rating === true ? null : true)}
                    className={`p-2 rounded-md transition-all ${
                      lastSwim.rating === true
                        ? 'bg-accent-blue text-white'
                        : 'hover:bg-dark-card text-gray-400'
                    }`}
                    title="Good swim"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => rateSession(lastSwim.id, lastSwim.rating === false ? null : false)}
                    className={`p-2 rounded-md transition-all ${
                      lastSwim.rating === false
                        ? 'bg-accent-coral text-white'
                        : 'hover:bg-dark-card text-gray-400'
                    }`}
                    title="Could be better"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/session/${lastSwim.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Full Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-dark-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Distance
                </div>
                <p className="font-display text-2xl font-bold">
                  {(lastSwim.distance / 1000).toFixed(2)} km
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(lastSwim.distance / 25)} lengths
                </p>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <p className="font-display text-2xl font-bold">
                  {lastSwim.duration} min
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor(lastSwim.duration / 60)}h {lastSwim.duration % 60}m
                </p>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Activity className="w-4 h-4" />
                  Pace
                </div>
                <p className="font-display text-2xl font-bold">
                  {formatPace(lastSwim.pace)}
                </p>
                <p className="text-xs text-gray-500 mt-1">min/100m</p>
              </div>

              <div className="bg-dark-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Target className="w-4 h-4" />
                  Strokes
                </div>
                <p className="font-display text-2xl font-bold">
                  {lastSwim.strokes.toLocaleString()}
                </p>
                {lastSwim.swolf > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    SWOLF: {lastSwim.swolf}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Comparison */}
            {sessions.length > 1 && (
              <div className="bg-dark-bg/30 rounded-lg p-4 border border-dark-border">
                <p className="text-sm text-gray-400 mb-3">vs. Your Average</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pace</p>
                    <p className={`text-sm font-semibold ${
                      lastSwim.pace < metrics.avgPace ? 'text-accent-blue' : 'text-accent-coral'
                    }`}>
                      {lastSwim.pace < metrics.avgPace ? '🚀 Faster' : '🐢 Slower'}
                      {' '}
                      {Math.abs(((lastSwim.pace - metrics.avgPace) / metrics.avgPace) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Distance</p>
                    <p className={`text-sm font-semibold ${
                      lastSwim.distance > metrics.totalDistance / sessions.length ? 'text-accent-blue' : 'text-gray-400'
                    }`}>
                      {lastSwim.distance > metrics.totalDistance / sessions.length ? '⬆️ Longer' : '⬇️ Shorter'}
                      {' '}
                      {Math.abs(((lastSwim.distance - metrics.totalDistance / sessions.length) / (metrics.totalDistance / sessions.length)) * 100).toFixed(1)}%
                    </p>
                  </div>
                  {lastSwim.swolf > 0 && metrics.avgSwolf > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SWOLF</p>
                      <p className={`text-sm font-semibold ${
                        lastSwim.swolf < metrics.avgSwolf ? 'text-accent-blue' : 'text-accent-coral'
                      }`}>
                        {lastSwim.swolf < metrics.avgSwolf ? '✨ Better' : '💪 Room to improve'}
                        {' '}
                        {Math.abs(((lastSwim.swolf - metrics.avgSwolf) / metrics.avgSwolf) * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* AI Coach Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏊</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Coach's Insight
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {coachingInsight}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
