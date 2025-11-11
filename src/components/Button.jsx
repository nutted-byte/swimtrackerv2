import { forwardRef } from 'react';

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

  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-60 disabled:cursor-not-allowed';

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

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
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

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
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
    </button>
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

  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-dark-card hover:bg-dark-card/80 text-content',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-dark-card text-content-tertiary hover:text-content',
  };

  const sizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
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
