import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
  iconSize = 'w-5 h-5',
  className = ''
}) => {
  // Auto-generate action if actionText and actionTo are provided
  const defaultAction = (actionText && actionTo) ? (
    <Link
      to={actionTo}
      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 group transition-colors"
    >
      {actionText}
      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </Link>
  ) : null;

  const actionElement = action || defaultAction;

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`${iconSize} ${iconColor}`} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-content-tertiary mt-0.5">{subtitle}</p>
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
