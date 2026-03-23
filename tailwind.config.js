/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      // Eden palette (semantic usage happens in CSS)
      eden: {
        lime: '#DBFF59',
        orange: '#FF660E',
        dark: '#203B32',
        elevated: '#364F47',
        light: '#FCFFF2',
        ink: '#1D261B',
      },
    },
    // Strict Rule of 8: map Tailwind spacing keys to multiples of 8px only.
    // Example: `p-1` => 8px (not Tailwind's default 4px).
    spacing: {
      '0': '0px',
      px: '2px',
      '1': '8px',
      '2': '16px',
      '3': '24px',
      '4': '32px',
      '5': '40px',
      '6': '48px',
      '7': '56px',
      '8': '64px',
      '9': '72px',
      '10': '80px',
      '12': '96px',
      '14': '112px',
      '16': '128px',
      '20': '160px',
      '24': '192px',
      '32': '256px',
      '40': '320px',
      '48': '384px',
    },
    borderRadius: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      full: '9999px',
    },
    boxShadow: {
      card: '0 8px 32px 0 rgba(0, 0, 0, 0.24)',
      elevated: '0 16px 48px 0 rgba(0, 0, 0, 0.32)',
    },
    fontFamily: {
      heading: ['Cormorant Infant', 'Georgia', 'serif'],
      body: ['Lufga', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      deco: ['170px', { lineHeight: '1' }],
      xs: ['12px', { lineHeight: '1.4' }],
      sm: ['14px', { lineHeight: '1.5' }],
      base: ['16px', { lineHeight: '1.5' }],
      lg: ['20px', { lineHeight: '1.6' }],
      xl: ['24px', { lineHeight: '1.5' }],
      '2xl': ['32px', { lineHeight: '1.2' }],
      '3xl': ['40px', { lineHeight: '1.1' }],
      '4xl': ['48px', { lineHeight: '1.05' }],
    },
    extend: {},
  },
  plugins: [],
}

