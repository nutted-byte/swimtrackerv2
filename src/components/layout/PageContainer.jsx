import { tokens } from '../../design/tokens';

/**
 * PageContainer
 *
 * Standard wrapper for all page content with consistent max-width and spacing.
 * Ensures all pages have the same horizontal margins and vertical rhythm.
 *
 * @param {ReactNode} children - Page content
 * @param {string} width - Container width token: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */
export const PageContainer = ({
  children,
  width = 'xl'
}) => {
  const widthClass = tokens.container[width];

  return (
    <div className={`${widthClass} mx-auto px-4 py-8 space-y-6`}>
      {children}
    </div>
  );
};
