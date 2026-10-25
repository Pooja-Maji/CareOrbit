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
      height: { bar: '64px' },
      spacing: { bar: '64px' },
      keyframes: {
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        popIn: { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        cardIn: { '0%': { opacity: '0', transform: 'translateX(48px) rotate(3deg)' }, '100%': { opacity: '1', transform: 'translateX(0) rotate(0)' } },
        cardInBack: { '0%': { opacity: '0', transform: 'translateX(-48px) rotate(-3deg)' }, '100%': { opacity: '1', transform: 'translateX(0) rotate(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        blob: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-20px) scale(1.1)' }, '66%': { transform: 'translate(-20px,20px) scale(0.95)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        ring: { '0%': { boxShadow: '0 0 0 0 rgba(179,38,30,0.55)' }, '100%': { boxShadow: '0 0 0 14px rgba(179,38,30,0)' } },
      },
      animation: {
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'pop-in': 'popIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'card-in': 'cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'card-in-back': 'cardInBack 0.45s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 45s linear infinite',
        blob: 'blob 14s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        ring: 'ring 1.8s ease-out infinite',
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
