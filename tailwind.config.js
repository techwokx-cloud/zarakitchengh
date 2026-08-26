/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zara-gold': '#FFC107',
        'zara-orange': '#FF9800',
        'zara-dark': '#1a1a1a',
        'zara-light': '#F5F5F5',
        'zara-green': '#4CAF50',
      },
      fontFamily: {
        'sans': ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
