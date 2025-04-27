/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#5e8b7e',
        'primary-dark': '#2f5d62',
        'primary-light': '#a7c4bc',
        'secondary': '#dfeeea',
        'accent': '#f2a154',
      }
    },
  },
  plugins: [],
};