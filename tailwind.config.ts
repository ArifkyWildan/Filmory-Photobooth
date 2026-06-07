import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#191714',
        surface:   '#27221E',
        surface2:  '#342D28',
        primary:   '#B17852',
        secondary: '#D7B899',
        accent:    '#F4E6D3',
        muted:     '#A89884',
        dim:       '#6B5C4E',
      },
      fontFamily: {
        serif:  ['Playfair Display', 'Georgia', 'serif'],
        sans:   ['DM Sans', 'system-ui', 'sans-serif'],
        mono:   ['Space Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
      },
      animation: {
        float:   'float 4s ease-in-out infinite',
        fadeUp:  'fadeUp 0.6s ease forwards',
        pulse2:  'pulse2 2s ease-in-out infinite',
        blink:   'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config