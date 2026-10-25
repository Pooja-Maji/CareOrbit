import React from 'react';
import { Sun, Moon } from './Icon';
import { useTheme } from '../../lib/theme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`tight relative w-[60px] h-10 rounded-full border border-plum/25 bg-plum-soft p-1 transition-colors ${className}`}
    >
      <span
        className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-marigold text-[#26102F] grid place-items-center shadow-xs transition-transform duration-300 ease-out ${dark ? 'translate-x-5' : ''}`}
      >
        {dark ? <Moon key="m" className="w-4 h-4 animate-spin-in" /> : <Sun key="s" className="w-4 h-4 animate-spin-in" />}
      </span>
    </button>
  );
};
