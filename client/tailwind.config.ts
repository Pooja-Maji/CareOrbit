import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Every colour is a CSS variable (see tokens.css) so light/dark just swaps the values.
        // Names kept (plum = violet, teal = cyan) so every screen re-themes without edits.
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        marigold: '#F2A93B',
        // text/overlay colour that sits on the header, footer and hero bars (dark on light mode, white on dark mode)
        bar: 'rgb(var(--c-bar-fg) / <alpha-value>)',
        plum: {
          DEFAULT: 'rgb(var(--c-plum) / <alpha-value>)',
          light: 'rgb(var(--c-plum-light) / <alpha-value>)',
          soft: 'rgb(var(--c-plum-soft) / <alpha-value>)',
          dark: 'rgb(var(--c-plum-dark) / <alpha-value>)',
        },
        teal: {
          DEFAULT: 'rgb(var(--c-teal) / <alpha-value>)',
          soft: 'rgb(var(--c-teal-soft) / <alpha-value>)',
          dark: 'rgb(var(--c-teal-dark) / <alpha-value>)',
        },
        coral: {
          DEFAULT: 'rgb(var(--c-coral) / <alpha-value>)',
          soft: 'rgb(var(--c-coral-soft) / <alpha-value>)',
          dark: 'rgb(var(--c-coral-dark) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--c-amber) / <alpha-value>)',
          soft: 'rgb(var(--c-amber-soft) / <alpha-value>)',
          dark: 'rgb(var(--c-amber-dark) / <alpha-value>)',
        },
        emergency: {
          DEFAULT: 'rgb(var(--c-emergency) / <alpha-value>)',
          soft: 'rgb(var(--c-emergency-soft) / <alpha-value>)',
          dark: 'rgb(var(--c-emergency-dark) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--c-ink-subtle) / <alpha-value>)',
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
        'soft': '0 4px 20px -2px rgba(126, 87, 194, 0.10), 0 2px 6px -1px rgba(126, 87, 194, 0.06)',
        'lifted': '0 12px 32px -4px rgba(126, 87, 194, 0.14), 0 4px 12px -2px rgba(126, 87, 194, 0.06)',
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
        spinIn: { '0%': { opacity: '0', transform: 'rotate(-90deg) scale(.5)' }, '100%': { opacity: '1', transform: 'rotate(0) scale(1)' } },
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
        'spin-in': 'spinIn .4s cubic-bezier(0.34,1.56,0.64,1) both',
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
