import React, { useEffect, useState } from 'react';

export interface ThresholdGaugeProps {
  score: number;
  threshold: number;
  maxScore?: number;
  title: string;
  source: string;
  unit?: string;
  level?: 'normal' | 'discuss' | 'urgent';
  /** True for measures like haemoglobin, where a LOW value is the concern. */
  lowIsConcern?: boolean;
}

export const ThresholdGauge: React.FC<ThresholdGaugeProps> = ({
  score,
  threshold,
  maxScore = 200,
  title,
  source,
  unit = 'pts',
  level = 'discuss',
  lowIsConcern = false,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Clamp score percentage for arc display between 0% and 100%
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const thresholdPct = Math.min(100, Math.max(0, (threshold / maxScore) * 100));

  const isCrossed = lowIsConcern ? score < threshold : score >= threshold;

  const strokeColor = isCrossed ? '#E4735A' : '#1F6F6B';
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = mounted ? circumference - (pct / 100) * circumference : circumference;

  return (
    <div className="tile flex flex-col items-center p-4 bg-white rounded-card border border-plum-soft shadow-soft text-center">
      <div className="w-full flex justify-between items-center text-xs text-ink-subtle mb-1">
        <span className="font-semibold uppercase tracking-wider">{title}</span>
        <span className="px-2 py-0.5 rounded-full bg-cream text-plum font-semibold border border-plum/10">
          {source}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden my-2">
        <svg viewBox="0 0 160 90" className="w-full h-full">
          {/* Background Track Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="#F5ECF3"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Threshold Marker Indicator */}
          {thresholdPct > 0 && thresholdPct < 100 && (
            <circle
              cx={80 - 70 * Math.cos((thresholdPct / 100) * Math.PI)}
              cy={80 - 70 * Math.sin((thresholdPct / 100) * Math.PI)}
              r="4"
              fill="#6B2D5C"
            />
          )}
        </svg>

        {/* Center Score readout */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-heading font-bold text-ink">
            {score}
            <span className="text-xs font-normal text-ink-subtle ml-1">{unit}</span>
          </span>
          <span className="text-[10px] text-ink-muted">
            Cut-off {threshold} {unit}
          </span>
        </div>
      </div>

      {/* Status Pill */}
      <div className="mt-1">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            isCrossed
              ? 'bg-coral-soft text-coral-dark border border-coral/30'
              : 'bg-teal-soft text-teal-dark border border-teal/30'
          }`}
        >
          {lowIsConcern
            ? isCrossed
              ? `Low · under ${threshold}`
              : `Healthy · ${threshold}+`
            : isCrossed
            ? `High · ${threshold}+`
            : `Under ${threshold}`}
        </span>
      </div>
    </div>
  );
};
