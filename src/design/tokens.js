/**
 * Design Tokens - Single Source of Truth
 *
 * This file defines all design tokens used throughout the application.
 * Tokens ensure consistency in spacing, typography, sizing, and visual hierarchy.
 */

export const tokens = {
  // Spacing Scale (based on 8px grid system)
  spacing: {
    xs: '0.5rem',    // 8px  - Tight spacing
    sm: '0.75rem',   // 12px - Small spacing
    md: '1rem',      // 16px - Medium spacing
    lg: '1.5rem',    // 24px - Large spacing
    xl: '2rem',      // 32px - Extra large spacing
    '2xl': '3rem',   // 48px - 2x extra large
    '3xl': '4rem',   // 64px - 3x extra large
  },

  // Typography Scale
  typography: {
    sizes: {
      xs: 'text-xs',       // 12px - Small labels, captions, badges
      sm: 'text-sm',       // 14px - Secondary text, button labels
      base: 'text-base',   // 16px - Body text, default
      lg: 'text-lg',       // 18px - Large body text, unit labels
      xl: 'text-xl',       // 20px - Section titles, CollapsibleSection, small milestones
      '2xl': 'text-2xl',   // 24px - Sticky bar titles, card metrics, records
      '3xl': 'text-3xl',   // 30px - InsightStatCard values
      '4xl': 'text-4xl',   // 36px - Page heroes, primary dashboard stats
    },
    weights: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    families: {
      sans: 'font-sans',      // Inter - body text
      display: 'font-display', // Space Grotesk - headings, numbers
    }
  },

  // Icon Sizes (width/height pairs)
  icons: {
    xs: 'w-3 h-3',     // 12px - Inline text icons, small indicators
    sm: 'w-4 h-4',     // 16px - Button icons, list item icons
    md: 'w-5 h-5',     // 20px - Standard UI icons, CollapsibleSection
    lg: 'w-6 h-6',     // 24px - Card header icons, section icons
    xl: 'w-8 h-8',     // 32px - Feature icons, RecordCard icons
    '2xl': 'w-10 h-10', // 40px - Page hero icons, large feature icons
    '3xl': 'w-12 h-12', // 48px - Extra large hero icons
  },

  // Border Radius Scale
  radius: {
    sm: 'rounded-lg',    // 8px  - Buttons, badges, small cards
    md: 'rounded-xl',    // 12px - Standard cards, inputs
    lg: 'rounded-2xl',   // 16px - Large cards, major containers
    full: 'rounded-full', // Circular - Pills, avatars, icon containers
  },

  // Grid & Flex Gap Spacing
  gap: {
    tight: 'gap-2',     // 8px  - Compact inline elements
    compact: 'gap-4',   // 16px - Dense grids, milestone cards
    default: 'gap-6',   // 24px - Standard grids, main content
    relaxed: 'gap-8',   // 32px - Spacious layouts, hero sections
  },

  // Section Spacing (margins between major sections)
  margin: {
    section: 'mb-6',    // 24px - Between major page sections
    group: 'mb-4',      // 16px - Between related groups of elements
    element: 'mb-2',    // 8px  - Between individual elements
    hero: 'mb-8',       // 32px - After hero sections
  },

  // Padding Scale (for containers and cards)
  padding: {
    tight: 'p-3',       // 12px - Compact cards, buttons
    default: 'p-4',     // 16px - Standard UI elements
    comfortable: 'p-6', // 24px - Cards, major containers
    spacious: 'p-8',    // 32px - Hero sections, large containers
  },

  // Container Widths
  container: {
    sm: 'max-w-2xl',   // 672px - Narrow content, forms
    md: 'max-w-4xl',   // 896px - Medium content
    lg: 'max-w-6xl',   // 1152px - Wide content
    xl: 'max-w-7xl',   // 1280px - Full width pages (standard)
    full: 'max-w-full', // 100% - Edge-to-edge
  },

  // Animation Durations
  animation: {
    fast: 'duration-150',    // 150ms - Micro-interactions
    default: 'duration-200', // 200ms - Standard transitions
    slow: 'duration-300',    // 300ms - Smooth animations
    slower: 'duration-500',  // 500ms - Hero animations
  },

  // Z-Index Layers (for consistent stacking)
  zIndex: {
    base: 'z-0',
    dropdown: 'z-10',
    sticky: 'z-20',
    modal: 'z-30',
    popover: 'z-40',
    tooltip: 'z-50',
  },
};

/**
 * Utility function to get token values
 * Usage: getToken('spacing', 'lg') => '1.5rem'
 */
export const getToken = (category, key) => {
  return tokens[category]?.[key] || '';
};

/**
 * Utility function to build className strings with tokens
 * Usage: buildTokenClass('gap', 'default', 'padding', 'comfortable')
 */
export const buildTokenClass = (...args) => {
  const classes = [];
  for (let i = 0; i < args.length; i += 2) {
    const category = args[i];
    const key = args[i + 1];
    const token = getToken(category, key);
    if (token) classes.push(token);
  }
  return classes.join(' ');
};

export default tokens;
