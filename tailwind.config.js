/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Noto Sans Khmer"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Signature accent — signal/terminal cyan. Used sparingly (progress, active states, focus rings).
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        // Secondary accent for English track (warm amber, differentiates from coding/cyan)
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Base surfaces — driven by CSS variables so the light/dark toggle
        // (see index.css :root vs .dark) can swap the entire palette at once.
        surface: {
          950: 'rgb(var(--surface-950) / <alpha-value>)',
          900: 'rgb(var(--surface-900) / <alpha-value>)',
          850: 'rgb(var(--surface-850) / <alpha-value>)',
          800: 'rgb(var(--surface-800) / <alpha-value>)',
          700: 'rgb(var(--surface-700) / <alpha-value>)',
          600: 'rgb(var(--surface-600) / <alpha-value>)',
          500: 'rgb(var(--surface-500) / <alpha-value>)',
          400: 'rgb(var(--surface-400) / <alpha-value>)',
          300: 'rgb(var(--surface-300) / <alpha-value>)',
          200: 'rgb(var(--surface-200) / <alpha-value>)',
          100: 'rgb(var(--surface-100) / <alpha-value>)',
          50: 'rgb(var(--surface-50) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.15), 0 8px 24px -4px rgba(34,211,238,0.12)',
        card: '0 1px 2px rgba(0,0,0,0.24), 0 8px 24px -8px rgba(0,0,0,0.4)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseRing: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        pulseRing: 'pulseRing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
