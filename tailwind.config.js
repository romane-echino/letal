/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          },
          '100%': {
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'bloom': '0 0 40px rgba(168, 85, 247, 0.3)',
        'bloom-lg': '0 0 60px rgba(168, 85, 247, 0.4)',
        'bloom-xl': '0 0 80px rgba(168, 85, 247, 0.5)',
      },
    },
  },
  plugins: [],
} 