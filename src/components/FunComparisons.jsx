import { motion } from 'framer-motion';
import { Card } from './Card';
import { Sparkles } from 'lucide-react';

export const FunComparisons = ({ comparisons }) => {
  if (!comparisons) {
    return null;
  }

  const { distance, strokes, duration } = comparisons;

  const ComparisonItem = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 bg-dark-bg/50 rounded-lg border border-dark-border hover:border-primary-500/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{item.label}</p>
          <p className="font-display text-2xl font-bold">{item.value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">{item.description}</p>
    </motion.div>
  );

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-500/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Fun Facts</h2>
          <p className="text-sm text-gray-400">Your swimming journey in perspective</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Distance Comparisons */}
        {distance && distance.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span>🏊</span> Distance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {distance.map((item, index) => (
                <ComparisonItem key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Stroke Comparisons */}
        {strokes && strokes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span>💪</span> Strokes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strokes.map((item, index) => (
                <ComparisonItem
                  key={item.label}
                  item={item}
                  index={distance.length + index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Duration Comparisons */}
        {duration && duration.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span>⏰</span> Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duration.map((item, index) => (
                <ComparisonItem
                  key={item.label}
                  item={item}
                  index={distance.length + strokes.length + index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
