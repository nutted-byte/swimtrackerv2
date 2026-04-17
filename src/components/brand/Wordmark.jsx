/**
 * Wordmark — Swimma's typographic lockup.
 * Instrument Sans at bold weight, tight tracking.
 * (Fraunces stays reserved for true hero moments where optical sizing pays off.)
 */
export const Wordmark = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }[size] || 'text-2xl';

  return (
    <span
      className={`font-display ${sizeClass} font-bold leading-none text-content ${className}`}
      style={{
        letterSpacing: '-0.02em',
      }}
    >
      Swimma
    </span>
  );
};

export default Wordmark;
