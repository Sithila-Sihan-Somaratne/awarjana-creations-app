/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#000000",
          light: "#1a1a1a",
          dark: "#000000",
        },
        yellow: {
          DEFAULT: "#FFD700",
          light: "#FFE066",
          dark: "#CCA300",
        },
        success: "#22c55e", // green
        error: "#ef4444", // red
      },
    },
  },
  plugins: [],
};
