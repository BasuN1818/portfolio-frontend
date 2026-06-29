/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        admin: {
          bg: 'var(--admin-bg)',
          surface: 'var(--admin-surface)',
          'surface-hover': 'var(--admin-surface-hover)',
          'surface-elevated': 'var(--admin-surface-elevated)',
          border: 'var(--admin-border)',
          'border-hover': 'var(--admin-border-hover)',
          'text-primary': 'var(--admin-text-primary)',
          'text-secondary': 'var(--admin-text-secondary)',
          'text-muted': 'var(--admin-text-muted)',
          primary: 'var(--admin-primary)',
          'primary-hover': 'var(--admin-primary-hover)',
          'primary-soft': 'var(--admin-primary-soft)',
          success: 'var(--admin-success)',
          warning: 'var(--admin-warning)',
          danger: 'var(--admin-danger)',
          info: 'var(--admin-info)',
        }
      },
      boxShadow: {
        '3d-sm': '0 1px 3px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)',
        '3d': '0 4px 6px rgba(0,0,0,0.07), 0 10px 20px rgba(0,0,0,0.06)',
        '3d-lg': '0 10px 25px rgba(0,0,0,0.1), 0 20px 48px rgba(0,0,0,0.08)',
        '3d-xl': '0 25px 50px rgba(0,0,0,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glow-indigo': '0 0 20px rgba(99,102,241,0.3)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.3)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.3)',
        'glow-rose': '0 0 20px rgba(244,63,94,0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
