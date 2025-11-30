/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
      },
      fontFamily: {
        arabic: ["Amiri", "Scheherazade", "sans-serif"],
      },
    },
  },
  plugins: [],
}