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
          50: '#e6f2f5',
          100: '#cce5eb',
          200: '#99cbd7',
          300: '#66b1c3',
          400: '#3397af',
          500: '#007d9b',  // Deep teal base
          600: '#00647c',
          700: '#004b5d',
          800: '#00323e',
          900: '#00191f',
        },
        accent: {
          blue: '#00d4ff',    // Electric blue
          coral: '#ff6b6b',   // Coral
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
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
