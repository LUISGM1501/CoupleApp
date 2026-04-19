/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fff2f3',
          100: '#ffe1e3',
          200: '#ffc3c7',
          300: '#f79ba2',
          400: '#ef7680',
          500: '#e05763',
          600: '#c83e4b',
          700: '#a52d38',
          800: '#81242d',
          900: '#61191f',
          DEFAULT: '#e05763',
        },
        blush: {
          50:  '#fff5f2',
          100: '#ffe4dc',
          200: '#ffc3b4',
          300: '#fa9b82',
          400: '#ec7458',
          500: '#d65638',
        },
        secondary: {
          100: '#efe4f5',
          200: '#dccae8',
          300: '#c3a9d5',
          400: '#a988bd',
          500: '#906ba3',
          DEFAULT: '#c3a9d5',
        },
        accent: {
          200: '#f8ddaa',
          300: '#efc178',
          400: '#e5a44a',
          DEFAULT: '#efc178',
        },
        cream: '#FFF8F5',
        dark:  '#2B1E22',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card:         '0 4px 20px rgba(192, 62, 75, 0.08)',
        'card-hover': '0 10px 32px rgba(192, 62, 75, 0.15)',
        soft:         '0 2px 14px rgba(224, 87, 99, 0.22)',
        glow:         '0 0 24px rgba(224, 87, 99, 0.35)',
      },
      backgroundImage: {
        'gradient-romantic': 'linear-gradient(135deg, #e05763 0%, #d65638 55%, #c3a9d5 100%)',
        'gradient-warm':     'linear-gradient(135deg, #ef7680 0%, #e05763 100%)',
        'gradient-soft':     'linear-gradient(180deg, #fff2f3 0%, #fdf1f3 50%, #f8f3fb 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(224,87,99,0.12) 0%, rgba(195,169,213,0.12) 100%)',
        'gradient-blush':    'linear-gradient(135deg, #fff5f2 0%, #ffe1e3 100%)',
      },
      animation: {
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'glow':       'glow 2.4s ease-in-out alternate infinite',
        'float':      'float 3.2s ease-in-out infinite',
        'heart':      'heart 1.4s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.04)', opacity: '0.92' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 10px rgba(224,87,99,0.25)' },
          '100%': { boxShadow: '0 0 28px rgba(224,87,99,0.55)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        heart: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%':      { transform: 'scale(1.15)' },
          '60%':      { transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
}
