import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { tokens } from '../../design/tokens';

/**
 * CardHeader - Reusable card header component
 *
 * A composition primitive for consistent card headers with icon, title, subtitle, and optional actions
 *
 * @param {React.Component} icon - Icon component from lucide-react
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional subtitle text below title
 * @param {React.ReactNode} badge - Optional badge component to display next to title
 * @param {React.ReactNode} action - Optional action element (button, link, etc.) on the right
 * @param {string} actionText - Optional text for default action link
 * @param {string} actionTo - Optional Link destination for default action
 * @param {string} iconColor - Icon color class (default: 'text-primary-400')
 * @param {string} iconBgColor - Icon background color class (default: 'bg-primary-500/20')
 * @param {string} className - Additional classes for the container
 */
export const CardHeader = ({
  icon: Icon,
  title,
  subtitle = null,
  badge = null,
  action = null,
  actionText = null,
  actionTo = null,
  iconColor = 'text-primary-400',
  iconBgColor = 'bg-primary-500/20',
  iconSize = tokens.icons.md,
  className = ''
}) => {
  // Auto-generate action if actionText and actionTo are provided
  const defaultAction = (actionText && actionTo) ? (
    <Link
      to={actionTo}
      className={`${tokens.typography.sizes.xs} text-primary-400 hover:text-primary-300 flex items-center gap-1 group transition-colors`}
    >
      {actionText}
      <ArrowRight className={`${tokens.icons.xs} group-hover:translate-x-1 transition-transform`} />
    </Link>
  ) : null;

  const actionElement = action || defaultAction;

  return (
    <div className={`flex items-center justify-between ${tokens.margin.section} ${className}`}>
      <div className={`flex items-center ${tokens.gap.tight}`}>
        {Icon && (
          <div className={`${tokens.padding.tight} ${tokens.radius.sm} ${iconBgColor}`}>
            <Icon className={`${iconSize} ${iconColor}`} />
          </div>
        )}
        <div>
          <div className={`flex items-center ${tokens.gap.tight}`}>
            <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.bold}`}>{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className={`${tokens.typography.sizes.xs} text-content-tertiary mt-0.5`}>{subtitle}</p>
          )}
        </div>
      </div>
      {actionElement && (
        <div className="flex-shrink-0">
          {actionElement}
        </div>
      )}
    </div>
  );
};
