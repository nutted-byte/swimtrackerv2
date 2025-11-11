import { tokens } from '../../design/tokens';

/**
 * Reusable metric display component
 */
export const MetricDisplay = ({ icon: Icon, label, value, subtitle, className = '' }) => {
  return (
    <div className={`bg-dark-bg/60 rounded-lg p-4 ${className}`}>
      <div className={`flex items-center ${tokens.gap.tight} text-content-tertiary text-sm mb-2`}>
        {Icon && <Icon className={tokens.icons.sm} />}
        {label}
      </div>
      <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-content-tertiary mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
