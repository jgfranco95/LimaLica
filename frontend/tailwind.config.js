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
        serif: ['"Fraunces"', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'fade-in-up-delay': 'fadeInUp 0.7s ease-out 0.15s both',
        'fade-in': 'fadeIn 0.8s ease-out both',
      },
    },
  },
  plugins: [],
}