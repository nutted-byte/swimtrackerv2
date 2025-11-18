import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { Card } from '../Card';
import { CardHeader, Separator } from '../primitives';
import { getLast12MonthsActivity } from '../../utils/streakCalculation';
import { tokens } from '../../design/tokens';

export const StreakCard = ({ sessions }) => {
  const [monthsToShow, setMonthsToShow] = useState(3);
  const allMonths = useMemo(() => getLast12MonthsActivity(sessions), [sessions]);
  const visibleMonths = useMemo(() => allMonths.slice(-monthsToShow), [allMonths, monthsToShow]);

  // Format pace for display
  const formatPace = (pace) => {
    if (!pace || pace <= 0) return '--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-primary-500/15 to-blue-500/15 border-primary-500/30">
        <CardHeader
          icon={Calendar}
          title="Monthly Summary"
          actionText="View all"
          actionTo="/swims"
          iconColor="text-accent-blue"
          iconBgColor="bg-accent-blue/20"
        />

        {/* Monthly Summary Table */}
        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>Month</th>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>Swims</th>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>Lengths</th>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>Distance</th>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>Avg Pace</th>
                <th className={`text-left align-middle py-3 px-3 ${tokens.typography.sizes.xs} ${tokens.typography.weights.semibold} uppercase tracking-wide text-content-secondary`}>SWOLF</th>
              </tr>
              <tr><td colSpan="6" className="p-0"><Separator spacing="none" /></td></tr>
            </thead>
            <tbody>
              {visibleMonths.slice().reverse().map((month, index) => (
                <motion.tr
                  key={month.monthKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="align-middle py-3 px-3">
                    <span className={`${tokens.typography.sizes.base} ${tokens.typography.weights.semibold} text-content-primary`}>
                      {month.monthName}
                    </span>
                  </td>
                  <td className="text-left align-middle py-3 px-3">
                    <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? month.sessionCount : '—'}
                    </span>
                  </td>
                  <td className="text-left align-middle py-3 px-3">
                    <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? month.totalLengths : '—'}
                    </span>
                  </td>
                  <td className="text-left align-middle py-3 px-3">
                    <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? `${(month.totalDistance / 1000).toFixed(1)}km` : '—'}
                    </span>
                  </td>
                  <td className="text-left align-middle py-3 px-3">
                    <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? formatPace(month.avgPace) : '—'}
                    </span>
                  </td>
                  <td className="text-left align-middle py-3 px-3">
                    <span className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity && month.avgSwolf > 0 ? Math.round(month.avgSwolf) : '—'}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {visibleMonths.length > 0 && (
                <tr><td colSpan="6" className="p-0"><Separator spacing="none" /></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Show More Button */}
        {monthsToShow < 12 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setMonthsToShow(prev => Math.min(prev + 3, 12))}
              className="flex items-center gap-2 px-4 py-2 text-xs text-accent-blue hover:text-primary-300 hover:bg-accent-blue/10 rounded-lg transition-colors"
            >
              Show more
              <ChevronDown className={tokens.icons.xs} />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
