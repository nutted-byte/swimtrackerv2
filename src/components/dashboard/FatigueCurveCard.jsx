import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../Card';
import { CardHeader } from '../primitives';
import {
  fatigueCurveForSession,
  medianFatigueCurveAcrossSessions,
  fatigueMetricsForSession,
} from '../../utils/analytics/fatigueCurve';
import { CHART_COLORS } from '../../utils/constants';
import { tokens } from '../../design/tokens';

const formatPace = (seconds) => {
  if (!seconds || !isFinite(seconds)) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds - m * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const verdictCopy = ({ verdict, fadeSec }) => {
  const abs = Math.round(Math.abs(fadeSec));
  if (verdict === 'faded') return `Faded ${abs}s/100m in the second half`;
  if (verdict === 'negative-split') return `Negative split — ${abs}s/100m faster in the second half`;
  return 'Even pacing throughout';
};

export const FatigueCurveCard = ({ sessions }) => {
  const data = useMemo(() => {
    const target = sessions.find((s) => fatigueCurveForSession(s));
    if (!target) return { state: 'empty' };

    const curve = fatigueCurveForSession(target);
    const median = medianFatigueCurveAcrossSessions(sessions, { excludeSessionId: target.id });
    const metrics = fatigueMetricsForSession(target);

    const medianByLap = new Map((median || []).map((p) => [p.lap, p.medianPaceSec]));
    const chartData = curve.map((point) => ({
      lap: point.lap,
      paceSec: point.paceSec,
      medianSec: medianByLap.get(point.lap) ?? null,
    }));

    return { state: 'ready', target, chartData, metrics, hasMedian: !!median };
  }, [sessions]);

  if (data.state === 'empty') return null;

  const { target, chartData, metrics, hasMedian } = data;

  const paces = chartData
    .flatMap((p) => [p.paceSec, p.medianSec])
    .filter((v) => typeof v === 'number');
  const yMin = Math.min(...paces);
  const yMax = Math.max(...paces);
  const pad = (yMax - yMin) * 0.15 || 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Card>
        <CardHeader
          icon={Activity}
          title="Fatigue Curve"
          subtitle={`Lap-by-lap pace — ${formatDate(target.date)}`}
          iconColor="text-accent-blue"
          iconBgColor="bg-accent-blue/20"
        />

        {metrics && (
          <div className={tokens.margin.section}>
            <div
              className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}
            >
              {verdictCopy(metrics)}
            </div>
            <div className={`${tokens.typography.sizes.sm} text-content-tertiary`}>
              First half {formatPace(metrics.firstHalfPaceSec)} → second half {formatPace(metrics.secondHalfPaceSec)} per 100m
            </div>
          </div>
        )}

        <div className="h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <XAxis
                dataKey="lap"
                tick={{ fill: CHART_COLORS.AXIS_LIGHT, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                hide
                domain={[yMin - pad, yMax + pad]}
                reversed
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1728',
                  border: `1px solid ${CHART_COLORS.BORDER}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: CHART_COLORS.AXIS_LIGHT }}
                formatter={(value, name) => [
                  typeof value === 'number' ? `${formatPace(value)} /100m` : '—',
                  name === 'paceSec' ? 'This swim' : 'Typical',
                ]}
                labelFormatter={(lap) => `Lap ${lap}`}
              />
              {hasMedian && (
                <Line
                  type="monotone"
                  dataKey="medianSec"
                  stroke={CHART_COLORS.COMPARE}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="paceSec"
                stroke={CHART_COLORS.PRIMARY}
                strokeWidth={2.5}
                dot={{ fill: CHART_COLORS.PRIMARY, r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {hasMedian && (
          <div className={`flex items-center ${tokens.gap.default} ${tokens.typography.sizes.xs} text-content-tertiary mt-3`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-accent-blue" />
              <span>This swim</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 border-t border-dashed" style={{ borderColor: CHART_COLORS.COMPARE }} />
              <span>Typical (median of prior swims)</span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
