import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { CalendarHeatmap } from '../ui/CalendarHeatmap';
import { calculateStreak, getLast30DaysActivity } from '../../utils/streakCalculation';

export const StreakCard = ({ sessions }) => {
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);
  const last30Days = useMemo(() => getLast30DaysActivity(sessions), [sessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/5 border-orange-500/30 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-content-secondary">
            Current Streak
          </span>
        </div>

        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block"
          >
            <div className="text-5xl font-bold text-orange-400 mb-1">
              {streak}
            </div>
            <div className="text-sm text-content-tertiary">
              {streak === 1 ? 'day' : 'days'}
            </div>
          </motion.div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-content-tertiary mb-2">
            <span>Last 30 days</span>
          </div>
          <CalendarHeatmap weeks={last30Days} />
        </div>

        <Link
          to="/sessions"
          className="text-xs text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1 group transition-colors"
        >
          Keep it going!
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Card>
    </motion.div>
  );
};
