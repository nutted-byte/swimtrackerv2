import { tokens } from '../../design/tokens';

/**
 * IconContainer - Standardized container for icons
 *
 * Provides consistent styling for icon wrappers across the application.
 * Supports different sizes and color variants.
 *
 * @param {React.ReactNode} icon - Icon element (from lucide-react or similar)
 * @param {string} size - Container size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * @param {string} variant - Color variant: 'primary' | 'accent' | 'success' | 'warning' | 'purple' | 'danger' (default: 'primary')
 * @param {boolean} rounded - Use rounded-full instead of rounded-xl (default: false)
 * @param {string} className - Additional CSS classes
 *
 * @example
 * // Medium primary icon container
 * <IconContainer icon={<Activity />} />
 *
 * @example
 * // Large accent rounded icon
 * <IconContainer
 *   icon={<Zap />}
 *   size="lg"
 *   variant="accent"
 *   rounded
 * />
 */
export const IconContainer = ({
  icon,
  size = 'md',
  variant = 'primary',
  rounded = false,
  className = ''
}) => {
  // Get size from tokens
  const sizeClass = tokens.components.iconContainer[size] || tokens.components.iconContainer.md;

  // Variant background colors
  const variantBg = {
    primary: 'bg-primary-500/20',
    accent: 'bg-accent-blue/20',
    success: 'bg-green-500/20',
    warning: 'bg-orange-500/20',
    purple: 'bg-purple-500/20',
    danger: 'bg-red-500/10',
  };

  // Variant icon colors
  const variantIconColor = {
    primary: 'text-primary-400',
    accent: 'text-accent-blue',
    success: 'text-green-400',
    warning: 'text-orange-400',
    purple: 'text-purple-400',
    danger: 'text-red-400',
  };

  const bgColor = variantBg[variant] || variantBg.primary;
  const iconColor = variantIconColor[variant] || variantIconColor.primary;

  // Build className
  const containerClasses = `
    ${sizeClass}
    ${rounded ? 'rounded-full' : 'rounded-xl'}
    ${bgColor}
    flex
    items-center
    justify-center
    flex-shrink-0
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      <div className={iconColor}>
        {icon}
      </div>
    </div>
  );
};
