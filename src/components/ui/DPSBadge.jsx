import { Activity } from 'lucide-react';
import { getDPSGrade } from '../../utils/strokeEfficiency';
import { useTheme } from '../../context/ThemeContext';

/**
 * Display DPS efficiency badge with grade
 */
export const DPSBadge = ({ dps }) => {
  const { isDark } = useTheme();
  const { grade, color, description } = getDPSGrade(dps);

  const colorClasses = {
    green: isDark
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-green-100 text-green-700 border-green-300',
    blue: isDark
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-blue-100 text-blue-700 border-blue-300',
    yellow: isDark
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      : 'bg-yellow-100 text-yellow-700 border-yellow-300',
    orange: isDark
      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      : 'bg-orange-100 text-orange-700 border-orange-300'
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClasses[color]}`}
      title={description}
    >
      <Activity className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{grade} Stroke Length</span>
        <span className="text-xs opacity-75">{dps.toFixed(2)}m/stroke</span>
      </div>
    </div>
  );
};
