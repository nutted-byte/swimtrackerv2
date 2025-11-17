import { forwardRef } from 'react';
import { tokens } from '../design/tokens.js';

/**
 * Button Component
 *
 * Reusable button component with consistent styling across the app.
 * Supports multiple variants, sizes, and states.
 *
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Full width button
 * @param {ReactNode} leftIcon - Icon to display on the left
 * @param {ReactNode} rightIcon - Icon to display on the right
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
export const Button = forwardRef(({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {

  // Base styles using tokens
  const baseStyles = `inline-flex items-center justify-center ${tokens.gap.tight} ${tokens.typography.weights.medium} ${tokens.radius.sm} transition-colors ${tokens.animation.default} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-60 disabled:cursor-not-allowed`;

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
    secondary: 'bg-dark-card hover:bg-dark-card/80 text-content',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    ghost: 'hover:bg-dark-card text-content-secondary hover:text-content',
    link: 'text-primary-400 hover:text-primary-300 underline-offset-4 hover:underline'
  };

  // Size styles using tokens
  const sizeStyles = {
    sm: `px-3 py-1 ${tokens.typography.sizes.sm}`,
    md: `px-4 py-2 ${tokens.typography.sizes.base}`,
    lg: `px-6 py-3 ${tokens.typography.sizes.lg}`
  };

  // Icon sizes using tokens
  const iconSizes = {
    sm: tokens.icons.xs,
    md: tokens.icons.sm,
    lg: tokens.icons.md
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size]}
    ${widthStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Only pass type prop if rendering a button element
  const elementProps = Component === 'button' ? { type } : {};

  return (
    <Component
      ref={ref}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...elementProps}
      {...props}
    >
      {leftIcon && (
        <span className={iconSizes[size]}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className={iconSizes[size]}>
          {rightIcon}
        </span>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

/**
 * IconButton Component
 *
 * Button with only an icon, no text.
 *
 * @param {string} variant - Button style
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {ReactNode} icon - Icon element
 * @param {string} ariaLabel - Accessible label for screen readers
 */
export const IconButton = forwardRef(({
  variant = 'ghost',
  size = 'md',
  icon,
  ariaLabel,
  className = '',
  ...props
}, ref) => {

  // Base styles using tokens
  const baseStyles = `inline-flex items-center justify-center ${tokens.radius.sm} transition-colors ${tokens.animation.default} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-60 disabled:cursor-not-allowed`;

  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-dark-card hover:bg-dark-card/80 text-content',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-dark-card text-content-tertiary hover:text-content',
  };

  // Size styles using spacing tokens (p-2 = 8px, p-3 = 12px, p-4 = 16px)
  const sizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  // Icon sizes using tokens
  const iconSizes = {
    sm: tokens.icons.sm,
    md: tokens.icons.md,
    lg: tokens.icons.lg
  };

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.ghost}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      type="button"
      className={buttonClasses}
      aria-label={ariaLabel}
      {...props}
    >
      <span className={iconSizes[size]}>
        {icon}
      </span>
    </button>
  );
});

IconButton.displayName = 'IconButton';
