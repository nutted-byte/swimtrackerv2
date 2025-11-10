import { Activity, TrendingUp, Zap } from 'lucide-react';
import { TIME_RANGE_OPTIONS } from '../../utils/constants';

/**
 * Controls for filtering and configuring the insights view
 */
export const InsightsControls = ({
  timeRange,
  setTimeRange,
  metric,
  setMetric,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Metric Selector */}
      <div>
        <p className="text-sm text-content-tertiary mb-2">Metric</p>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric('pace')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              metric === 'pace'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-card text-content-tertiary hover:text-content-secondary'
            }`}
          >
            <Activity className="w-4 h-4" />
            Pace
          </button>
          <button
            onClick={() => setMetric('distance')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              metric === 'distance'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-card text-content-tertiary hover:text-content-secondary'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Distance
          </button>
          <button
            onClick={() => setMetric('swolf')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              metric === 'swolf'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-card text-content-tertiary hover:text-content-secondary'
            }`}
          >
            <Zap className="w-4 h-4" />
            SWOLF
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div>
        <p className="text-sm text-content-tertiary mb-2">Time Range</p>
        <div className="flex gap-2 flex-wrap">
          {TIME_RANGE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                timeRange === value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-content-tertiary hover:text-content-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
