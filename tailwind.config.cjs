/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce_x: {
          '0%, 100%': { transform: 'translateX(0rem)' },
          '50%': { transform: 'translateX(.5rem)' },
        }
      },
      animation: {
        bounce_x: 'bounce_x 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
