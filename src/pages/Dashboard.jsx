import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Activity, TrendingUp, Zap } from 'lucide-react';

export const Dashboard = () => {
  // Mock data - will be replaced with real data later
  const isImproving = true;
  const improvementPercentage = 8;

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
            glow={isImproving}
            className="inline-block px-12 py-6 text-center"
          >
            <motion.div
              animate={isImproving ? { y: [-5, 0, -5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 justify-center">
                <span className="text-6xl">
                  {isImproving ? '✅' : '⚠️'}
                </span>
                <div className="text-left">
                  <p className="text-3xl font-display font-bold text-accent-blue">
                    You're improving!
                  </p>
                  <p className="text-lg text-gray-400">
                    +{improvementPercentage}% over last 30 days
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
          You've swum 8% faster over the last 30 days, and your SWOLF is improving.
          Keep focusing on consistent pacing!
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
          value="2:15"
          unit="min/100m"
          trend={8}
          icon={Activity}
          glow={true}
        />
        <StatCard
          label="SWOLF"
          value="42"
          trend={-5}
          icon={Zap}
        />
        <StatCard
          label="Total Distance"
          value="12.5"
          unit="km"
          icon={TrendingUp}
        />
      </motion.div>

      {/* AI Coach Card - Coming Soon */}
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
                Your pacing is getting more consistent! The last three sessions show
                a steady rhythm. Try increasing distance gradually while maintaining
                this pace.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
