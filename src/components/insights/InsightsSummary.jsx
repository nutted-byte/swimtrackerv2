import { InsightStatCard } from '../InsightStatCard';
import { Activity, TrendingUp, Zap, Award } from 'lucide-react';
import { formatPace } from '../../utils/formatters';
import { tokens } from '../../design/tokens';

/**
 * Summary statistics cards for insights
 */
export const InsightsSummary = ({
  stats,
  compareData,
  trends,
  sparklineData,
  consistencyScore,
}) => {
  const { avgPace, totalDistance, avgSwolf } = stats;
  const { paceSparkline, distanceSparkline, swolfSparkline } = sparklineData;
  const { paceTrend, distanceTrend, swolfTrend } = trends;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 ${tokens.gap.default} mb-8`}>
      <InsightStatCard
        label="Avg Pace"
        value={formatPace(avgPace)}
        unit="min/100m"
        delta={compareData.deltas?.pace}
        trend={paceTrend.trend}
        sparklineData={paceSparkline}
        icon={Activity}
        metricName="Pace"
      />

      <InsightStatCard
        label="Total Distance"
        value={totalDistance.toFixed(1)}
        unit="km"
        delta={compareData.deltas?.distance}
        trend={distanceTrend.trend}
        sparklineData={distanceSparkline}
        icon={TrendingUp}
        metricName="Distance"
      />

      {!isNaN(avgSwolf) && avgSwolf > 0 && (
        <InsightStatCard
          label="Avg SWOLF"
          value={Math.round(avgSwolf)}
          delta={compareData.deltas?.swolf}
          trend={swolfTrend.trend}
          sparklineData={swolfSparkline}
          icon={Zap}
          metricName="SWOLF"
        />
      )}

      <InsightStatCard
        label="Consistency Score"
        value={consistencyScore}
        unit="/100"
        icon={Award}
        metricName="Consistency"
      />
    </div>
  );
};
