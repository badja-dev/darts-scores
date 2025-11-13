/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'darts-bg': '#0a0e1a',
        'darts-card': '#1a1f2e',
        'darts-primary': '#a3e635',
        'darts-secondary': '#ec4899',
      }
    },
  },
  plugins: [],
}
