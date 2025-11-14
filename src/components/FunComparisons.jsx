import { motion } from 'framer-motion';
import { Card } from './Card';
import { CardHeader } from './primitives';
import { Sparkles } from 'lucide-react';
import { tokens } from '../design/tokens';

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
      className={`${tokens.padding.default} bg-dark-bg/50 ${tokens.radius.sm} transition-colors`}
    >
      <div className={`flex items-center ${tokens.gap.tight} ${tokens.margin.element}`}>
        <span className={tokens.typography.sizes['2xl']}>{item.icon}</span>
        <div className="flex-1">
          <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>{item.label}</p>
          <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>{item.value}</p>
        </div>
      </div>
      <p className={`${tokens.typography.sizes.xs} text-content-tertiary`}>{item.description}</p>
    </motion.div>
  );

  return (
    <Card>
      <CardHeader
        icon={Sparkles}
        title="Fun Facts"
        subtitle="Your swimming journey in perspective"
        iconColor="text-primary-400"
        iconBgColor="bg-primary-500/20"
        iconSize={tokens.icons.lg}
      />

      <div className="space-y-6">
        {/* Distance Comparisons */}
        {distance && distance.length > 0 && (
          <div>
            <h3 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-tertiary mb-3 flex items-center ${tokens.gap.tight}`}>
              <span>🏊</span> Distance
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.gap.compact}`}>
              {distance.map((item, index) => (
                <ComparisonItem key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Stroke Comparisons */}
        {strokes && strokes.length > 0 && (
          <div>
            <h3 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-tertiary mb-3 flex items-center ${tokens.gap.tight}`}>
              <span>💪</span> Strokes
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.gap.compact}`}>
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
            <h3 className={`${tokens.typography.sizes.sm} ${tokens.typography.weights.semibold} text-content-tertiary mb-3 flex items-center ${tokens.gap.tight}`}>
              <span>⏰</span> Time
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.gap.compact}`}>
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
