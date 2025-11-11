import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { Card } from '../Card';
import { CardHeader } from '../primitives';
import { getLast12MonthsActivity } from '../../utils/streakCalculation';

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
      <Card className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 border-primary-500/20">
        <CardHeader
          icon={Calendar}
          title="Monthly Summary"
          actionText="View all"
          actionTo="/swims"
          iconColor="text-blue-400"
          iconBgColor="bg-blue-500/20"
        />

        {/* Monthly Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">Month</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">Swims</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">Lengths</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">Distance</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">Avg Pace</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-content-tertiary">SWOLF</th>
              </tr>
            </thead>
            <tbody>
              {visibleMonths.slice().reverse().map((month, index) => (
                <motion.tr
                  key={month.monthKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`border-b border-gray-800/30 ${
                    month.isCurrentMonth ? 'bg-blue-500/10' : 'hover:bg-gray-800/20'
                  } transition-colors`}
                >
                  <td className="py-3 px-3">
                    <span className={`text-base font-medium ${
                      month.isCurrentMonth ? 'text-blue-400' : 'text-content-primary'
                    }`}>
                      {month.monthName}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-base ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? month.sessionCount : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-base ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? month.totalLengths : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-base ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? `${(month.totalDistance / 1000).toFixed(1)}km` : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-base ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity ? formatPace(month.avgPace) : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-base ${month.hasActivity ? 'text-content-primary' : 'text-content-tertiary'}`}>
                      {month.hasActivity && month.avgSwolf > 0 ? Math.round(month.avgSwolf) : '—'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More Button */}
        {monthsToShow < 12 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setMonthsToShow(prev => Math.min(prev + 3, 12))}
              className="flex items-center gap-2 px-4 py-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              Show more
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
