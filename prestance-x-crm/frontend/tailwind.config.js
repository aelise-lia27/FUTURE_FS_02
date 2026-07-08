/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep black tones — 900 = dark background, 50 = light
        ink: {
          50: '#f6f6f7',
          100: '#e8e8ea',
          200: '#c9c9cd',
          300: '#a3a3aa',
          400: '#71717a',
          500: '#4a4a52',
          600: '#333338',
          700: '#232328',
          800: '#18181b',
          900: '#0b0b0d',
        },
        // Subtle gold — 500 = primary accent
        gold: {
          50: '#fbf7ec',
          100: '#f5eacf',
          200: '#ead29c',
          300: '#deb96a',
          400: '#d2a54b',
          500: '#c19a3e',
          600: '#a37f31',
          700: '#7d6226',
          800: '#59461c',
          900: '#3a2e13',
        },
        // Off-white / broken white
        cream: {
          50: '#fffefb',
          100: '#fdfaf3',
          200: '#faf3e4',
          300: '#f5ebd3',
          400: '#efe0ba',
          500: '#e6d29c',
        },
        // Leather brown
        leather: {
          50: '#f8f2ec',
          100: '#eeddca',
          200: '#dab98d',
          300: '#c4925f',
          400: '#a8753f',
          500: '#8a5a30',
          600: '#6f4726',
          700: '#54351d',
          800: '#3a2414',
          900: '#20140b',
        },
      },
    },
  },
  plugins: [],
};
