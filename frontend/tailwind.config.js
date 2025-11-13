/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'darts-bg': 'var(--color-darts-bg)',
        'darts-card': 'var(--color-darts-card)',
        'darts-primary': 'var(--color-darts-primary)',
        'darts-secondary': 'var(--color-darts-secondary)',
      }
    },
  },
  plugins: [],
}
