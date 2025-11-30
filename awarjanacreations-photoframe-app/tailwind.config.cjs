/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffceb',
          500: '#FFD600', // yellow accent
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@shadcn/ui/plugin'),
  ],
};