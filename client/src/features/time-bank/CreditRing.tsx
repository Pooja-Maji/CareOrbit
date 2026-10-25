/**
 * SthreeCare - Credit Ring
 * Owner: Person B (Stage 11)
 * 
 * Signature Visual: Multi-segment circular ring visualizing Earned,
 * Used, and Sponsored Time Bank hours in a unified graphic.
 */

import React from 'react';

interface CreditRingProps {
  earned: number;
  used: number;
  sponsored: number;
  balance: number;
  size?: number;
}

export const CreditRing: React.FC<CreditRingProps> = ({
  earned,
  used,
  sponsored,
  balance,
  size = 180,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalPool = Math.max(1, earned + sponsored + used);

  const earnedPercent = (earned / totalPool) * 100;
  const sponsoredPercent = (sponsored / totalPool) * 100;
  const usedPercent = (used / totalPool) * 100;

  const earnedDash = (earnedPercent / 100) * circumference;
  const sponsoredDash = (sponsoredPercent / 100) * circumference;
  const usedDash = (usedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Base Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ECEEF5"
            strokeWidth={strokeWidth}
          />

          {/* Earned Segment (Teal) */}
          {earned > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#0E7490"
              strokeWidth={strokeWidth}
              strokeDasharray={`${earnedDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          )}

          {/* Sponsored Segment (Plum) */}
          {sponsored > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#4C1D95"
              strokeWidth={strokeWidth}
              strokeDasharray={`${sponsoredDash} ${circumference}`}
              strokeDashoffset={-earnedDash}
              strokeLinecap="round"
            />
          )}

          {/* Used Segment (Amber) */}
          {used > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#B7791F"
              strokeWidth={strokeWidth - 4}
              strokeDasharray={`${usedDash} ${circumference}`}
              strokeDashoffset={-(earnedDash + sponsoredDash)}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-heading font-bold text-ink">
            {balance.toFixed(1)}
          </span>
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Hours Available
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-teal" />
          <span className="text-ink">Earned: <strong>{earned.toFixed(1)}h</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-plum" />
          <span className="text-ink">Sponsored Pool: <strong>{sponsored.toFixed(1)}h</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber" />
          <span className="text-ink">Used: <strong>{used.toFixed(1)}h</strong></span>
        </div>
      </div>
    </div>
  );
};
