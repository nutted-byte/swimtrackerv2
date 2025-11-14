import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';

/**
 * Display DPS comparison to average with visual indicator
 */
export const DPSComparison = ({ currentDPS, averageDPS }) => {
  const { isDark } = useTheme();

  if (!averageDPS || averageDPS === 0) {
    return null;
  }

  const diff = currentDPS - averageDPS;
  const percentDiff = (diff / averageDPS) * 100;
  const isImprovement = diff > 0;

  return (
    <div className="flex items-center gap-1">
      {isImprovement ? (
        <>
          <TrendingUp className={`${tokens.icons.xs} text-green-400`} />
          <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-400'}`}>
            +{percentDiff.toFixed(1)}% vs avg
          </span>
        </>
      ) : (
        <>
          <TrendingDown className={`${tokens.icons.xs} text-orange-500`} />
          <span className={`text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {percentDiff.toFixed(1)}% vs avg
          </span>
        </>
      )}
    </div>
  );
};
