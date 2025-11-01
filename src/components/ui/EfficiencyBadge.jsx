import { motion } from 'framer-motion';
import { Award, Zap, TrendingUp } from 'lucide-react';

export const EfficiencyBadge = ({ swolf, avgSwolf }) => {
  if (!swolf || swolf <= 0) return null;

  // Calculate efficiency rating
  const getEfficiencyRating = (currentSwolf, averageSwolf) => {
    if (!averageSwolf || averageSwolf === 0) {
      // No baseline - use absolute SWOLF ranges
      if (currentSwolf < 40) return { level: 'excellent', label: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30', icon: Award };
      if (currentSwolf < 50) return { level: 'good', label: 'Good', color: 'text-primary-400', bgColor: 'bg-primary-500/20', borderColor: 'border-primary-500/30', icon: Zap };
      return { level: 'moderate', label: 'Room to Improve', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', icon: TrendingUp };
    }

    // Compare to personal average
    const improvement = ((averageSwolf - currentSwolf) / averageSwolf) * 100;

    if (improvement > 5) return { level: 'excellent', label: 'Excellent Efficiency', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30', icon: Award };
    if (improvement > -5) return { level: 'good', label: 'Good Efficiency', color: 'text-primary-400', bgColor: 'bg-primary-500/20', borderColor: 'border-primary-500/30', icon: Zap };
    return { level: 'moderate', label: 'Room to Improve', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', icon: TrendingUp };
  };

  const rating = getEfficiencyRating(swolf, avgSwolf);
  const Icon = rating.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${rating.bgColor} ${rating.borderColor}`}
    >
      <Icon className={`w-4 h-4 ${rating.color}`} />
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${rating.color}`}>
          {rating.label}
        </span>
        {avgSwolf > 0 && (
          <span className="text-xs text-content-tertiary">
            SWOLF: {swolf} {avgSwolf && `(avg: ${avgSwolf.toFixed(0)})`}
          </span>
        )}
      </div>
    </motion.div>
  );
};
