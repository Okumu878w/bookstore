import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B3921F',
          light: '#E8CE7A',
        },
        cream: '#FAF6EE',
        ink: {
          DEFAULT: '#1C3F60',
          deep: '#14212E',
        },
        slate: {
          muted: '#5E7488',
        },
        line: '#E4DBC7',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
} satisfies Config
