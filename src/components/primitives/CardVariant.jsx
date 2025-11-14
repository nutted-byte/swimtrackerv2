import { Card } from '../Card';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../design/tokens';

/**
 * CardVariant - Standardized card with consistent variant styles
 *
 * A wrapper around Card that provides consistent gradient backgrounds and borders
 * across the application. Supports both dark and light modes.
 *
 * @param {string} variant - Card style variant: 'primary' | 'accent' | 'success' | 'warning' | 'purple'
 * @param {boolean} withBorder - Whether to include the variant border (default: true)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Card content
 * @param {object} ...props - Additional props passed to Card component
 *
 * @example
 * // Primary variant card
 * <CardVariant variant="primary">
 *   <h2>Card Title</h2>
 *   <p>Card content...</p>
 * </CardVariant>
 *
 * @example
 * // Accent variant without border
 * <CardVariant variant="accent" withBorder={false}>
 *   <h2>Card Title</h2>
 * </CardVariant>
 */
export const CardVariant = ({
  variant = 'primary',
  withBorder = true,
  className = '',
  children,
  ...props
}) => {
  const { isDark } = useTheme();

  // Get variant styles from tokens
  const variantConfig = tokens.components.cardVariants[variant] || tokens.components.cardVariants.primary;

  // Select appropriate styles based on theme
  const gradient = isDark ? variantConfig.gradient : variantConfig.lightGradient;
  const border = isDark ? variantConfig.border : variantConfig.lightBorder;

  // Build className
  const cardClasses = `
    bg-gradient-to-br
    ${gradient}
    ${withBorder ? border : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Card className={cardClasses} {...props}>
      {children}
    </Card>
  );
};
