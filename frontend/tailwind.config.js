/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--theme-primary)',
        'brand-hover': 'var(--theme-hover)',
      }
    },
  },
  plugins: [],
}
