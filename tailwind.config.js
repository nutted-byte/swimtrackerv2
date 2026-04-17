/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ocean-inspired color palette
        primary: {
          50: '#e6f4f6',
          100: '#cce9ed',
          200: '#99d3db',
          300: '#66bdc9',
          400: '#33a7b7',
          500: '#006B7D',  // Deeper ocean teal (was #007d9b)
          600: '#005664',
          700: '#00404b',
          800: '#002b32',
          900: '#001519',
        },
        accent: {
          blue: '#00d4ff',    // Electric blue
          coral: '#ff6b6b',   // Coral (legacy)
        },
        // Ocean semantic palette — replaces stock Tailwind state colors.
        // Named for Swimma's world so positive/negative/warning/info feel authored.
        kelp: {
          50: '#ecfbf5',
          100: '#d1f4e4',
          200: '#9fe8c5',
          300: '#66d6a0',
          400: '#3ec089',   // primary success in dark mode
          500: '#1ba06a',
          600: '#118354',
          700: '#0c6642',
          800: '#084a31',
          900: '#042f20',
        },
        coral: {
          50: '#fff0ee',
          100: '#ffdcd6',
          200: '#ffb4a7',
          300: '#ff8876',
          400: '#ff6b6b',   // primary danger in dark mode
          500: '#e04646',
          600: '#b82f2f',
          700: '#8a2222',
          800: '#5e1717',
          900: '#360c0c',
        },
        'amber-tide': {
          50: '#fff7e8',
          100: '#ffebc2',
          200: '#ffd984',
          300: '#ffc149',
          400: '#f2ae2c',   // primary warning in dark mode
          500: '#d08d15',
          600: '#a26c10',
          700: '#754e0c',
          800: '#4a3207',
          900: '#241803',
        },
        'deep-violet': {
          50: '#f1ecff',
          100: '#ded3ff',
          200: '#baa5ff',
          300: '#9374ff',
          400: '#7a55ff',   // primary info in dark mode
          500: '#5e35e6',
          600: '#4623b8',
          700: '#34188a',
          800: '#21105c',
          900: '#10082e',
        },
        dark: {
          bg: 'rgb(var(--color-bg))',
          card: 'rgb(var(--color-card))',
          border: 'rgb(var(--color-border))',
          text: 'rgb(var(--color-text))',
          'text-muted': 'rgb(var(--color-text-muted))',
        },
        content: {
          DEFAULT: 'rgb(var(--color-content))',
          secondary: 'rgb(var(--color-content-secondary))',
          tertiary: 'rgb(var(--color-content-tertiary))',
        },
        // Light mode surface colors
        surface: {
          tint: 'rgb(var(--color-surface-tint))',
          accent: 'rgb(var(--color-surface-accent))',
        }
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['"Instrument Sans"', 'Geist', 'system-ui', 'sans-serif'],
        editorial: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Dark mode shadows (deeper, more dramatic)
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

        // Light mode shadows (soft, layered, modern)
        'card-light': '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover-light': '0 10px 20px rgba(15, 23, 42, 0.08), 0 3px 6px rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',

        // Glows (theme-aware)
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-coral': '0 0 20px rgba(255, 107, 107, 0.3)',
        'glow-blue-light': '0 0 20px rgba(0, 125, 155, 0.15)',
        'glow-coral-light': '0 0 20px rgba(255, 107, 107, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
