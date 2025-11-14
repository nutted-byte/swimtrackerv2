import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { CardVariant, CardHeader, CircularProgressBar } from '../primitives';
import { calculateMonthlyProgress } from '../../utils/progressCalculations';
import { tokens } from '../../design/tokens';


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
      <CardVariant variant="primary" className="h-full">
        <CardHeader
          icon={BarChart3}
          title="This Month"
          iconColor="text-primary-400"
          iconBgColor="bg-primary-500/20"
          iconSize={tokens.icons.sm}
        />

        <div className="flex justify-center mb-4">
          <CircularProgressBar
            percentage={progress.percentage}
            size="md"
            color="blue"
            animationDelay={0.2}
          />
        </div>

        <div className="text-center mb-4">
          <p className="text-xl font-bold mb-1">
            {(progress.current / 1000).toFixed(1)} / {(progress.goal / 1000).toFixed(1)} km
          </p>

          {progress.isGoalMet ? (
            <p className="text-sm text-green-400 flex items-center justify-center gap-1">
              <CheckCircle className={tokens.icons.sm} />
              Goal achieved!
            </p>
          ) : (
            <p className="text-sm text-content-tertiary">
              {(progress.remaining / 1000).toFixed(1)} km to goal
            </p>
          )}
        </div>

        <Link
          to="/insight"
          className="text-xs text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1 group transition-colors"
        >
          View Full Progress
          <ArrowRight className={`${tokens.icons.xs} group-hover:translate-x-1 transition-transform`} />
        </Link>
      </CardVariant>
    </motion.div>
  );
};
