import React from 'react';

/** Decorative line-art leaf sprig (stroke = currentColor). */
export const Sprig: React.FC<{ className?: string }> = ({ className = '' }) => {
  const leaf = 'M0 0 C 9 -10 9 -26 0 -38 C -9 -26 -9 -10 0 0 Z';
  const leaves: { y: number; r: number; s: number }[] = [
    { y: 112, r: -38, s: 0.85 },
    { y: 100, r: 36, s: 0.85 },
    { y: 80, r: -34, s: 0.95 },
    { y: 66, r: 32, s: 0.95 },
    { y: 46, r: -28, s: 0.9 },
    { y: 34, r: 26, s: 0.85 },
  ];
  return (
    <svg viewBox="-50 -10 100 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M0 130 C 2 90 -2 50 0 8" />
      <g transform="translate(0 8)">
        <path d={leaf} transform="scale(.8)" />
      </g>
      {leaves.map((l, i) => (
        <path key={i} d={leaf} transform={`translate(0 ${l.y}) rotate(${l.r}) scale(${l.s})`} />
      ))}
    </svg>
  );
};
