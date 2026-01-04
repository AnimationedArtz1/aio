/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Dark Colors
        'deep-space': '#050505',
        'surface': '#0a0b10',
        'surface-elevated': '#12131a',
        
        // Primary Accent Gradient
        'electric-blue': '#3b82f6',
        'neon-purple': '#8b5cf6',
        
        // Extended Palette
        'accent-cyan': '#22d3ee',
        'accent-pink': '#ec4899',
        'accent-amber': '#f59e0b',
        
        // Glass Effects
        'glass': {
          'bg': 'rgba(255, 255, 255, 0.02)',
          'border': 'rgba(255, 255, 255, 0.06)',
          'highlight': 'rgba(255, 255, 255, 0.1)',
        },
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.02)',
        'glass-hover': 'rgba(255, 255, 255, 0.04)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-sm': '12px',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.06)',
        'glass-hover': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.15)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.15)',
        'glow-sm': '0 0 20px rgba(59, 130, 246, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)',
        'card-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [],
}
