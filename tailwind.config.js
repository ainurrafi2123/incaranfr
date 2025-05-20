/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // jika kamu pakai App Router
    './pages/**/*.{js,ts,jsx,tsx}', // jika pakai Pages Router
    './components/**/*.{js,ts,jsx,tsx}', // jika ada folder komponen
  ],
  theme: {
    extend: {
      colors:{
        primary:"#2E6DE2",
        secondary:"#FFD35A",
        accent:"#FF9C5A"
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        clash: ['var(--font-clash)', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'float-slow': 'float 5s ease-in-out 2s infinite',
      }
    },
  },
  plugins: [],
}
