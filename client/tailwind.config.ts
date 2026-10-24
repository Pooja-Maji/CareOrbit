import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F4',
        plum: {
          DEFAULT: '#6B2D5C',
          light: '#883A76',
          soft: '#F5ECF3',
          dark: '#511F45',
        },
        teal: {
          DEFAULT: '#1F6F6B',
          soft: '#E8F4F3',
          dark: '#16524F',
        },
        coral: {
          DEFAULT: '#E4735A',
          soft: '#FDF1EE',
          dark: '#C8573E',
        },
        amber: {
          DEFAULT: '#B7791F',
          soft: '#FDF7EB',
          dark: '#935F16',
        },
        emergency: {
          DEFAULT: '#B3261E',
          soft: '#FDECEB',
          dark: '#8C1D18',
        },
        ink: {
          DEFAULT: '#241B22',
          muted: '#61555E',
          subtle: '#8C7F89',
        },
      },
      borderRadius: {
        'card': '20px',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 45, 92, 0.06), 0 2px 6px -1px rgba(107, 45, 92, 0.04)',
        'lifted': '0 12px 32px -4px rgba(107, 45, 92, 0.12), 0 4px 12px -2px rgba(107, 45, 92, 0.06)',
      },
      minHeight: {
        'tap': '48px',
      },
      minWidth: {
        'tap': '48px',
      },
    },
  },
  plugins: [],
} satisfies Config;
