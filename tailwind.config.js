/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#050505',
        'electric-blue': '#3b82f6',
        'neon-purple': '#8b5cf6',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.02)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
