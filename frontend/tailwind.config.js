/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Lima Lica
        aqua: {
          DEFAULT: '#7FD8C6',
          light: '#A9E6DA',
          dark: '#5FC0AC',
        },
        blush: {
          DEFAULT: '#E8C8D0',
          light: '#F3E0E5',
          dark: '#D9A8B4',
        },
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
