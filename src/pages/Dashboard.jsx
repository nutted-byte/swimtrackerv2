import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Activity, TrendingUp, Zap, Upload } from 'lucide-react';
import { useSwimData } from '../context/SwimDataContext';
import { analyzeProgress, generateCoachingInsight } from '../utils/analytics';

export const Dashboard = () => {
  const { sessions } = useSwimData();

  // Analyze progress from real data
  const analysis = analyzeProgress(sessions, 30);
  const coachingInsight = generateCoachingInsight(analysis);

  const { status, message, improving, metrics } = analysis;

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

      {/* AI Coach Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
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
