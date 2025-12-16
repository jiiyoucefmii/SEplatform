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
        alhuda: "#024C3F",
        alhudaYellow: "#FEC737",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 600ms ease-out both',
        'slide-in-left': 'slide-in-left 700ms cubic-bezier(.2,.9,.2,1) both',
        'slide-in-right': 'slide-in-right 700ms cubic-bezier(.2,.9,.2,1) both',
        'pop': 'pop 500ms cubic-bezier(.2,.9,.2,1) both',
      },
      fontFamily: {
        arabic: ["Amiri", "Scheherazade", "sans-serif"],
        readex: ["Readex Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
}