import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'sthreecare_theme';

export const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (t: Theme) => {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0F0A15' : '#3B1A4A');
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  useEffect(() => applyTheme(theme), [theme]);
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch {}
      return next;
    });
  }, []);
  return { theme, toggle };
};
