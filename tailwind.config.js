/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6',
        primary: {
          DEFAULT: '#2D2926',
          muted: '#4B4642',
        },
        secondary: {
          DEFAULT: '#E87D0D',
          hover: '#CD6E0B',
        },
        accent: {
          light: '#FDF2E9',
          DEFAULT: '#F5E6DA',
        },
        muted: '#A5A29F',
      },
      fontFamily: {
        sans: ['"Outfit"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.50rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

