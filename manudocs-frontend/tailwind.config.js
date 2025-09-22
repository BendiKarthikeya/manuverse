/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manu-green': '#10B981',
        'manu-dark': '#1F2937',
        'manu-light': '#F9FAFB',
      }
    },
  },
  plugins: [],
}
