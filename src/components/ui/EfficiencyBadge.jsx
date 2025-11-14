import { motion } from 'framer-motion';
import { Award, Zap, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const EfficiencyBadge = ({ swolf, avgSwolf }) => {
  const { isDark } = useTheme();

  if (!swolf || swolf <= 0) return null;

  // Calculate efficiency rating
  const getEfficiencyRating = (currentSwolf, averageSwolf) => {
    if (!averageSwolf || averageSwolf === 0) {
      // No baseline - use absolute SWOLF ranges
      if (currentSwolf < 40) return {
        level: 'excellent',
        label: 'Excellent',
        colorDark: 'text-green-400',
        colorLight: 'text-green-400',
        bgColorDark: 'bg-green-500/20',
        bgColorLight: 'bg-green-50',
        borderColorDark: 'border-green-500/30',
        borderColorLight: 'border-green-200',
        icon: Award
      };
      if (currentSwolf < 50) return {
        level: 'good',
        label: 'Good',
        colorDark: 'text-primary-400',
        colorLight: 'text-primary-700',
        bgColorDark: 'bg-primary-500/20',
        bgColorLight: 'bg-primary-50',
        borderColorDark: 'border-primary-500/30',
        borderColorLight: 'border-primary-200',
        icon: Zap
      };
      return {
        level: 'moderate',
        label: 'Room to Improve',
        colorDark: 'text-orange-400',
        colorLight: 'text-orange-700',
        bgColorDark: 'bg-orange-500/20',
        bgColorLight: 'bg-orange-50',
        borderColorDark: 'border-orange-500/30',
        borderColorLight: 'border-orange-200',
        icon: TrendingUp
      };
    }

    // Compare to personal average
    const improvement = ((averageSwolf - currentSwolf) / averageSwolf) * 100;

    if (improvement > 5) return {
      level: 'excellent',
      label: 'Excellent Efficiency',
      colorDark: 'text-green-400',
      colorLight: 'text-green-400',
      bgColorDark: 'bg-green-500/20',
      bgColorLight: 'bg-green-50',
      borderColorDark: 'border-green-500/30',
      borderColorLight: 'border-green-200',
      icon: Award
    };
    if (improvement > -5) return {
      level: 'good',
      label: 'Good Efficiency',
      colorDark: 'text-primary-400',
      colorLight: 'text-primary-700',
      bgColorDark: 'bg-primary-500/20',
      bgColorLight: 'bg-primary-50',
      borderColorDark: 'border-primary-500/30',
      borderColorLight: 'border-primary-200',
      icon: Zap
    };
    return {
      level: 'moderate',
      label: 'Room to Improve',
      colorDark: 'text-orange-400',
      colorLight: 'text-orange-700',
      bgColorDark: 'bg-orange-500/20',
      bgColorLight: 'bg-orange-50',
      borderColorDark: 'border-orange-500/30',
      borderColorLight: 'border-orange-200',
      icon: TrendingUp
    };
  };

  const rating = getEfficiencyRating(swolf, avgSwolf);
  const Icon = rating.icon;

  const color = isDark ? rating.colorDark : rating.colorLight;
  const bgColor = isDark ? rating.bgColorDark : rating.bgColorLight;
  const borderColor = isDark ? rating.borderColorDark : rating.borderColorLight;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${bgColor} ${borderColor}`}
    >
      <Icon className={`${tokens.icons.sm} ${color}`} />
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${color}`}>
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
