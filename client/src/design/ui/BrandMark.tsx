import React from 'react';

/** SthreeCare mark: a compass needle with a marigold thread running through it. */
export const BrandMark: React.FC<{ size?: number; className?: string; tone?: 'dark' | 'light' }> = ({
  size = 36,
  className = '',
  tone = 'dark',
}) => {
  const bg = tone === 'dark' ? 'rgb(var(--c-plum))' : '#FFFFFF';
  const needle = tone === 'dark' ? '#FFFFFF' : '#3B1A4A';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill={bg} />
      <path d="M20 7l5.2 13L20 33l-5.2-13L20 7z" fill={needle} />
      <path d="M20 7l5.2 13H14.8L20 7z" fill="#F2A93B" />
      <circle cx="20" cy="20" r="2.1" fill={bg} />
    </svg>
  );
};
