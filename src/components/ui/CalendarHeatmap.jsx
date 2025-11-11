import { motion } from 'framer-motion';

export const CalendarHeatmap = ({ days, weeks }) => {
  const getIntensityColor = (hasActivity, intensity) => {
    if (!hasActivity) return 'bg-dark-border';

    switch (intensity) {
      case 3: return 'bg-orange-500';
      case 2: return 'bg-orange-400';
      case 1: return 'bg-orange-300';
      default: return 'bg-dark-border';
    }
  };

  // If weeks are provided, render 30-day view (4 weeks)
  if (weeks) {
    return (
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-0.5 justify-center">
            {week.days.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
              >
                <div
                  className={`w-3 h-3 rounded-lg transition-colors ${getIntensityColor(day.hasActivity, day.intensity)}`}
                  title={`${day.date}: ${day.hasActivity ? `Swam ${(day.totalDistance / 1000).toFixed(1)}km` : 'Rest day'}`}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Otherwise render 7-day view (original)
  return (
    <div className="flex gap-2 justify-center">
      {days.map((day, index) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-8 h-8 rounded-lg transition-colors ${getIntensityColor(day.hasActivity, day.intensity)}`}
            title={`${day.date}: ${day.hasActivity ? `Swam ${(day.totalDistance / 1000).toFixed(1)}km` : 'Rest day'}`}
          />
          <span className="text-[9px] text-content-tertiary uppercase">
            {day.dayLetter}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
