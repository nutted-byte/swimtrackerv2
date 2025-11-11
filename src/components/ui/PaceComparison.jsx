import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const PaceComparison = ({ currentPace, averagePace }) => {
  if (!currentPace || !averagePace || averagePace === 0) return null;

  // Convert pace (min/100m) to seconds per 25m
  const currentSecondsPer25m = (currentPace * 60) / 4;
  const averageSecondsPer25m = (averagePace * 60) / 4;

  // Calculate difference in seconds per 25m (negative means current is faster)
  const secDiff = currentSecondsPer25m - averageSecondsPer25m;
  const absDiff = Math.abs(secDiff);

  // Determine status
  let status = 'neutral';
  let Icon = Minus;
  let color = 'text-content-tertiary';
  let bgColor = 'bg-gray-500/20';
  let borderColor = 'border-gray-500/30';
  let label = 'On pace';

  if (absDiff < 0.5) {
    // Within 0.5 seconds per 25m - neutral
    status = 'neutral';
  } else if (secDiff < 0) {
    // Faster than average (good)
    status = 'faster';
    Icon = TrendingUp;
    color = 'text-green-400';
    bgColor = 'bg-green-500/20';
    borderColor = 'border-green-500/30';
    label = `${absDiff.toFixed(1)}s/25m faster`;
  } else {
    // Slower than average
    status = 'slower';
    Icon = TrendingDown;
    color = 'text-orange-400';
    bgColor = 'bg-orange-500/20';
    borderColor = 'border-orange-500/30';
    label = `${absDiff.toFixed(1)}s/25m slower`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${bgColor} ${borderColor}`}
    >
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>
        {label}
      </span>
    </motion.div>
  );
};
