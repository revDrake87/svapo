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
        brand: 'rgb(var(--theme-primary) / <alpha-value>)',
        'brand-hover': 'rgb(var(--theme-hover) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}
