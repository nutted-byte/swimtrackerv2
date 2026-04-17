import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Card } from '../Card';
import { CardHeader } from '../primitives';
import {
  longestContinuousEver,
  longestContinuousByMonth,
  countSessionsWithLapTimestamps,
} from '../../utils/analytics/continuousSwim';
import { CHART_COLORS } from '../../utils/constants';
import { tokens } from '../../design/tokens';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatDistance = (meters) =>
  meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters} m`;

export const LongestSwimHeroCard = ({ sessions }) => {
  const data = useMemo(() => {
    const withLaps = countSessionsWithLapTimestamps(sessions);
    if (withLaps === 0) return { state: 'empty' };

    const best = longestContinuousEver(sessions);
    const monthly = longestContinuousByMonth(sessions, 12);
    return { state: 'ready', best, monthly, withLaps };
  }, [sessions]);

  if (data.state === 'empty') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card>
          <CardHeader
            icon={Waves}
            title="Longest Continuous Swim"
            iconColor="text-accent-blue"
            iconBgColor="bg-accent-blue/20"
          />
          <div className={`${tokens.padding.section} text-center`}>
            <p className={`${tokens.typography.sizes.base} text-content-secondary ${tokens.margin.element}`}>
              No lap-level data yet.
            </p>
            <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>
              Export "Distance Swimming" from the Simple Health Export app and upload it on the Upload page to unlock this.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const { best, monthly } = data;
  const bestMeters = best?.distance ?? 0;
  const maxMonthly = Math.max(...monthly.map((m) => m.longestMeters), 1);
  const chartMax = Math.max(bestMeters, maxMonthly);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <Card>
        <CardHeader
          icon={Waves}
          title="Longest Continuous Swim"
          subtitle="Biggest unbroken swim, month by month"
          iconColor="text-accent-blue"
          iconBgColor="bg-accent-blue/20"
        />

        <div className={tokens.margin.section}>
          <div className={`${tokens.typography.sizes.xs} text-content-tertiary uppercase tracking-wide`}>
            Lifetime best
          </div>
          <div
            className={`${tokens.typography.families.display} ${tokens.typography.sizes['4xl']} ${tokens.typography.weights.bold} text-accent-blue`}
          >
            {formatDistance(bestMeters)}
          </div>
          {best && (
            <div className={`${tokens.typography.sizes.sm} text-content-tertiary`}>
              Set {formatDate(best.date)}
            </div>
          )}
        </div>

        <div className="h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, chartMax * 1.1]} />
              {bestMeters > 0 && (
                <ReferenceLine
                  y={bestMeters}
                  stroke={CHART_COLORS.MILESTONE}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `PR ${formatDistance(bestMeters)}`,
                    position: 'insideTopRight',
                    fill: CHART_COLORS.MILESTONE,
                    fontSize: 10,
                  }}
                />
              )}
              <Bar dataKey="longestMeters" radius={[4, 4, 0, 0]}>
                {monthly.map((m, i) => (
                  <Cell
                    key={i}
                    fill={m.hasData ? CHART_COLORS.PRIMARY : '#1e293b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
