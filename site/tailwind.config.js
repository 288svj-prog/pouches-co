/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0A',
          secondary: '#151515',
          tertiary: '#1F1F1F',
        },
        edge: {
          DEFAULT: '#2A2A2A',
          muted: '#1F1F1F',
        },
        ink: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          muted: '#666666',
        },
        accent: {
          DEFAULT: '#CCFF00',
          on: '#0A0A0A',
        },
        danger: '#FF4444',
        verified: '#00B67A',
      },
      fontFamily: {
        display: ['"Anton"', '"Bebas Neue"', '"Druk Wide"', 'Impact', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['10rem', { lineHeight: '0.95', fontWeight: '700' }],
        'display-l': ['5.5rem', { lineHeight: '1.0', fontWeight: '700' }],
        'display-m': ['3.5rem', { lineHeight: '1.0', fontWeight: '700' }],
        'display-s': ['2.25rem', { lineHeight: '1.05', fontWeight: '700' }],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.08em',
      },
      borderRadius: {
        pill: '9999px',
        // Editorial brand — cards are squared (no rounding); pills + inputs keep
        // soft corners so buttons and form fields still feel approachable.
        card: '0px',
        modal: '0px',
        input: '4px',
      },
      boxShadow: {
        'glow-accent': '0 0 0 2px rgba(204, 255, 0, 0.2)',
        'glow-accent-strong': '0 0 24px rgba(204, 255, 0, 0.35)',
      },
      transitionTimingFunction: {
        'pouch-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'pouch-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'pouch-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseAccent: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(204, 255, 0, 0.6)' },
          '50%': { boxShadow: '0 0 0 8px rgba(204, 255, 0, 0)' },
        },
        barFill: {
          '0%': { width: '0%' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        'slide-up': 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-accent': 'pulseAccent 400ms ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
