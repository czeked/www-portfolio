/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c0ff',
          300: '#66a0ff',
          400: '#3380ff',
          500: '#0060ff',
          600: '#0050cc',
          700: '#004099',
          800: '#003066',
          900: '#002033',
        },
      },
    },
  },
  plugins: [],
}
