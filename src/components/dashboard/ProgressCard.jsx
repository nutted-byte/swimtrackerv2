import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { CircularProgress } from '../ui/CircularProgress';
import { calculateMonthlyProgress } from '../../utils/progressCalculations';

export const ProgressCard = ({ sessions }) => {
  const progress = useMemo(
    () => calculateMonthlyProgress(sessions),
    [sessions]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-primary-500/20 to-primary-500/5 border-primary-500/30 h-full">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-content-secondary">
            This Month
          </span>
        </div>

        <div className="flex justify-center mb-4">
          <CircularProgress
            percentage={progress.percentage}
            size={100}
            strokeWidth={10}
            color="#00d4ff"
          />
        </div>

        <div className="text-center mb-4">
          <p className="text-xl font-bold mb-1">
            {(progress.current / 1000).toFixed(1)} / {(progress.goal / 1000).toFixed(1)} km
          </p>

          {progress.isGoalMet ? (
            <p className="text-sm text-green-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Goal achieved!
            </p>
          ) : (
            <p className="text-sm text-content-tertiary">
              {(progress.remaining / 1000).toFixed(1)} km to goal
            </p>
          )}
        </div>

        <Link
          to="/insights"
          className="text-xs text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1 group transition-colors"
        >
          View Full Progress
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Card>
    </motion.div>
  );
};
