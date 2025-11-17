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
      '5xl': 'text-5xl',   // 48px - Large page heroes, session detail
      '6xl': 'text-6xl',   // 60px - Extra large heroes, featured content
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
    },
    // Semantic colors for state-based text
    semantic: {
      success: 'text-green-400',   // Positive states, improvements, achievements
      danger: 'text-red-400',      // Negative states, declines, errors
      warning: 'text-yellow-400',  // Caution, moderate changes, attention needed
      warningAlt: 'text-orange-400', // Alternative warning for emphasis
      info: 'text-purple-400',     // Information, special features, AI-related
    },
    // Primary color usage guidelines
    // - text-primary-400: Default for dark mode (icons, accents, interactive elements)
    // - text-primary-500: Standard for light mode, main brand color
    // - text-primary-600: Darker shade for light mode hover states
    // - text-primary-700: Very dark, high contrast text on light backgrounds
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

  // Component Styles (centralized visual patterns)
  components: {
    // Card base styles (NO inline borders or shadows - use global .card class)
    card: {
      base: 'bg-dark-card rounded-2xl p-6',
      compact: 'bg-dark-card rounded-xl p-4',
      hero: 'bg-gradient-to-br',
    },

    // Card variants with consistent gradients & borders
    cardVariants: {
      primary: {
        gradient: 'from-primary-500/20 to-primary-500/5',
        border: 'border-primary-500/30',
        lightGradient: 'from-primary-50 to-blue-50',
        lightBorder: 'border-primary-200',
      },
      accent: {
        gradient: 'from-accent-blue/20 to-accent-blue/5',
        border: 'border-accent-blue/30',
        lightGradient: 'from-blue-50 to-cyan-50',
        lightBorder: 'border-accent-blue/20',
      },
      success: {
        gradient: 'from-green-500/20 to-emerald-500/5',
        border: 'border-green-500/30',
        lightGradient: 'from-green-50 to-emerald-50',
        lightBorder: 'border-green-200',
      },
      warning: {
        gradient: 'from-orange-500/20 to-yellow-500/5',
        border: 'border-orange-500/30',
        lightGradient: 'from-orange-50 to-yellow-50',
        lightBorder: 'border-orange-200',
      },
      purple: {
        gradient: 'from-purple-500/20 to-purple-500/5',
        border: 'border-purple-500/30',
        lightGradient: 'from-purple-50 to-pink-50',
        lightBorder: 'border-purple-200',
      },
      danger: {
        gradient: 'from-red-500/10 to-red-500/5',
        border: 'border-red-500/20',
        lightGradient: 'from-red-50 to-pink-50',
        lightBorder: 'border-red-200',
      },
    },

    // Standard opacity levels for backgrounds
    opacities: {
      subtle: '10',    // bg-dark-bg/10
      light: '20',     // bg-dark-bg/20
      medium: '40',    // bg-dark-bg/40
      strong: '60',    // bg-dark-bg/60
    },

    // Icon container styles
    iconContainer: {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    },

    // Standard separator border
    separator: 'border-dark-border/20',

    // Accent borders for visual emphasis (when you MUST use a border)
    accentBorder: {
      primary: 'border border-primary-500/30',
      blue: 'border border-accent-blue/30',
      coral: 'border border-accent-coral/30',
      green: 'border border-green-500/30',
      yellow: 'border border-yellow-500/30',
      orange: 'border border-orange-500/30',
      purple: 'border border-purple-500/30',
    },

    // Section dividers
    divider: {
      horizontal: 'border-t border-dark-border/50',
      vertical: 'border-l border-dark-border/50',
    },

    // Difficulty levels (for technique cards)
    difficulty: {
      beginner: {
        gradient: 'from-green-500/20 to-green-500/5',
        border: 'border-green-500/30',
        text: 'text-green-400',
        lightGradient: 'from-green-50 to-emerald-50',
        lightBorder: 'border-green-200',
      },
      intermediate: {
        gradient: 'from-blue-500/20 to-blue-500/5',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        lightGradient: 'from-blue-50 to-cyan-50',
        lightBorder: 'border-blue-200',
      },
      advanced: {
        gradient: 'from-purple-500/20 to-purple-500/5',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        lightGradient: 'from-purple-50 to-indigo-50',
        lightBorder: 'border-purple-200',
      },
    },

    // State-based styles
    states: {
      dragging: 'border-accent-blue border-2 bg-primary-500/10',
      hover: 'hover:bg-dark-card/80',
      focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
    },
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
