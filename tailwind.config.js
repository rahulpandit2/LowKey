/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // white/[0.08]
        input: 'var(--color-input)', // zinc-900
        ring: 'var(--color-ring)', // green-600
        background: 'var(--color-background)', // near-black #030303
        foreground: 'var(--color-foreground)', // zinc-300
        primary: {
          DEFAULT: 'var(--color-primary)', // green-600
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // zinc-800
          foreground: 'var(--color-secondary-foreground)', // zinc-300
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // zinc-800
          foreground: 'var(--color-muted-foreground)', // zinc-500
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // blue-500
          foreground: 'var(--color-accent-foreground)', // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // #0a0a0a
          foreground: 'var(--color-popover-foreground)', // zinc-300
        },
        card: {
          DEFAULT: 'var(--color-card)', // #0a0a0a
          foreground: 'var(--color-card-foreground)', // zinc-300
        },
        success: {
          DEFAULT: 'var(--color-success)', // green-600
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)', // white
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      fontSize: {
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        '0.2em': '0.2em',
        '0.3em': '0.3em',
      },
      lineHeight: {
        '0.85': '0.85',
      },
    },
  },
  plugins: [],
};