/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d7a5',
          300: '#f5ba6d',
          400: '#f09533',
          500: '#ec7a13',
          600: '#dd5f09',
          700: '#b7470a',
          800: '#923810',
          900: '#763010',
          950: '#401606',
        },
        togo: {
          green: '#009639',
          'green-light': '#00c44d',
          'green-dark': '#007a2f',
          yellow: '#FFD100',
          'yellow-light': '#ffe033',
          'yellow-dark': '#e6bc00',
          red: '#D21034',
          'red-light': '#e8354f',
          'red-dark': '#b00d2b',
          dark: '#12121f',
          darker: '#0a0a14',
          surface: '#1a1a2e',
          'surface-light': '#242440',
        },
        india: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#000080',
        },
        africa: {
          terracotta: '#C2452D',
          ochre: '#CC7722',
          gold: '#DAA520',
          bronze: '#CD7F32',
          earth: '#8B4513',
          kente: '#FF9700',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-slow': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-light': 'bounceSubtle 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 150, 57, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 150, 57, 0.25)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 150, 57, 0.15), 0 0 60px rgba(0, 150, 57, 0.05)',
        'glow-yellow': '0 0 20px rgba(255, 209, 0, 0.15), 0 0 60px rgba(255, 209, 0, 0.05)',
        'glow-red': '0 0 20px rgba(210, 16, 52, 0.15)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
