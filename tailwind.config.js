/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepInk: '#020408',
        neuralCyan: '#22D3EE',
        roseCrimson: '#E11D48',
        electricIndigo: '#4F46E5',
        emeraldStability: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        '3xl': '64px',
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
        'scanline': 'scanline 10s linear infinite',
        'warp': 'warp 1.2s cubic-bezier(0.83, 0, 0.17, 1) forwards',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        warp: {
          '0%': { transform: 'scale(1) translateZ(0)', opacity: 1 },
          '100%': { transform: 'scale(10) translateZ(500px)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}
