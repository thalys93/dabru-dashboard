/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'bebas': ['Bebas Neue, cursive'],
      'blinker': ['Blinker, sans-serif'],
      'abel': ['Abel, sans-serif'],
    },
    screens: {
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
    },
    extend: {
      colors: {
        PJwhite: "#DEDEDE",
        gray: "#545454",
        black: "#3A3A3A",
      }
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('@tailwindcss/typography'),
  ],
}

