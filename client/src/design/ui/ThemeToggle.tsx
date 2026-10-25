import React from 'react';
import { Sun, Moon } from './Icon';
import { useTheme } from '../../lib/theme';

/**
 * Light / dark switch. `onBar` = sits on the violet header; otherwise on a normal surface.
 */
export const ThemeToggle: React.FC<{ className?: string; onBar?: boolean }> = ({ className = '', onBar = false }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const track = onBar
    ? 'bg-white/15 border-white/25 hover:bg-white/25'
    : 'bg-plum-soft border-plum/25 hover:border-plum/50';
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative w-[60px] h-10 rounded-full border p-1 transition-colors flex-shrink-0 ${track} ${className}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-8 h-8 rounded-full grid place-items-center shadow-soft transition-transform duration-300 ease-out ${
          dark ? 'translate-x-5 bg-[#22D3EE] text-[#0E0B1A]' : 'bg-marigold text-[#26102F]'
        }`}
      >
        {dark ? <Moon key="m" className="w-4 h-4 animate-spin-in" /> : <Sun key="s" className="w-4 h-4 animate-spin-in" />}
      </span>
    </button>
  );
};
