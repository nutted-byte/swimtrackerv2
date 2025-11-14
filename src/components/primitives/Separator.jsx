import { tokens } from '../../design/tokens';

/**
 * Separator - Standardized divider component
 *
 * Provides consistent visual separation between content sections.
 * Uses the standardized separator token for uniform styling.
 *
 * @param {string} orientation - 'horizontal' | 'vertical' (default: 'horizontal')
 * @param {string} spacing - Margin spacing: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 *
 * @example
 * // Horizontal separator with default spacing
 * <Separator />
 *
 * @example
 * // Vertical separator with no spacing
 * <Separator orientation="vertical" spacing="none" />
 *
 * @example
 * // Custom spacing
 * <Separator spacing="lg" />
 */
export const Separator = ({
  orientation = 'horizontal',
  spacing = 'md',
  className = ''
}) => {
  // Spacing options
  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  };

  const spacingClass = spacingClasses[spacing] || spacingClasses.md;

  // Build className based on orientation
  const separatorClasses = `
    ${orientation === 'horizontal' ? 'border-t' : 'border-l'}
    ${tokens.components.separator}
    ${spacingClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return <div className={separatorClasses} />;
};
