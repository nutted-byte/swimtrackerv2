import { motion } from 'framer-motion';
import { Card } from '../Card';
import { formatPace } from '../../utils/formatters';
import { tokens } from '../../design/tokens';

/**
 * Display milestone achievements (best pace, longest swim, best SWOLF)
 */
export const InsightsMilestones = ({ milestones }) => {
  if (!milestones) return null;

  const { bestPace, longestSwim, bestSwolf } = milestones;

  if (!bestPace && !longestSwim && !bestSwolf) return null;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.compact} mb-8`}>
      {bestPace && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⭐</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Best Pace</p>
                <p className="font-display text-xl font-bold text-yellow-400">
                  {formatPace(bestPace.pace)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(bestPace.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {longestSwim && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏊</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Longest Swim</p>
                <p className="font-display text-xl font-bold text-yellow-400">
                  {(longestSwim.distance / 1000).toFixed(2)} km
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(longestSwim.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {bestSwolf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:border-yellow-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚡</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Best SWOLF</p>
                <p className="font-display text-xl font-bold text-yellow-400">
                  {bestSwolf.swolf}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(bestSwolf.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
