import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Card } from '../Card';
import { CardHeader } from '../primitives';
import {
  bestTimeForDistanceEver,
  countSessionsWithLapTimestamps,
} from '../../utils/analytics/continuousSwim';
import { tokens } from '../../design/tokens';

const TARGET_DISTANCES = [50, 100, 200, 400];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds - m * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const BestTimesCard = ({ sessions }) => {
  const prs = useMemo(() => {
    if (countSessionsWithLapTimestamps(sessions) === 0) return null;
    return TARGET_DISTANCES.map((distance) => ({
      distance,
      best: bestTimeForDistanceEver(sessions, distance),
    }));
  }, [sessions]);

  if (!prs) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader
            icon={Trophy}
            title="Personal Records"
            iconColor="text-accent-blue"
            iconBgColor="bg-accent-blue/20"
          />
          <div className={`${tokens.padding.section} text-center`}>
            <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>
              Upload lap-level data to unlock distance PRs.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader
          icon={Trophy}
          title="Personal Records"
          subtitle="Fastest unbroken time at each distance"
          iconColor="text-accent-blue"
          iconBgColor="bg-accent-blue/20"
        />

        <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.gap.compact}`}>
          {prs.map(({ distance, best }) => (
            <div
              key={distance}
              className={`${tokens.padding.default} ${tokens.radius.md} bg-dark-bg/50 border border-dark-border/30`}
            >
              <div
                className={`${tokens.typography.sizes.xs} text-content-tertiary uppercase tracking-wide`}
              >
                {distance}m
              </div>
              {best ? (
                <>
                  <div
                    className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}
                  >
                    {formatTime(best.timeSeconds)}
                  </div>
                  <div className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                    {formatDate(best.date)}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-content-tertiary`}
                  >
                    —
                  </div>
                  <div className={`${tokens.typography.sizes.xs} text-content-tertiary`}>
                    Not yet
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
