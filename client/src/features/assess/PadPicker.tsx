import React from 'react';
import type { PbacInputs } from '@sthreecare/shared';
import { calculatePbacScore } from '@sthreecare/compass';
import { Card } from '../../design/ui/Card';
import { Info } from '../../design/ui/Icon';

export interface PadPickerProps {
  value: PbacInputs;
  onChange: (val: PbacInputs) => void;
}

export const PadPicker: React.FC<PadPickerProps> = ({ value, onChange }) => {
  const currentScore = calculatePbacScore(value);
  const isAboveThreshold = currentScore >= 100;

  const updatePad = (type: 'light' | 'moderate' | 'saturated', delta: number) => {
    const current = value.pad[type] || 0;
    const next = Math.max(0, current + delta);
    onChange({
      ...value,
      pad: {
        ...value.pad,
        [type]: next,
      },
    });
  };

  const updateClot = (type: 'small' | 'large', delta: number) => {
    const current = value.clot[type] || 0;
    const next = Math.max(0, current + delta);
    onChange({
      ...value,
      clot: {
        ...value.clot,
        [type]: next,
      },
    });
  };

  const updateFlooding = (delta: number) => {
    const current = value.flooding || 0;
    onChange({
      ...value,
      flooding: Math.max(0, current + delta),
    });
  };

  const padOptions = [
    {
      id: 'light' as const,
      name: 'Lightly Stained',
      pts: '1 pt each',
      img: '/illustrations/pad-light.svg',
      count: value.pad.light,
      desc: 'Small spot or light staining',
    },
    {
      id: 'moderate' as const,
      name: 'Moderately Soiled',
      pts: '5 pts each',
      img: '/illustrations/pad-moderate.svg',
      count: value.pad.moderate,
      desc: 'Central absorption area soaked',
    },
    {
      id: 'saturated' as const,
      name: 'Completely Saturated',
      pts: '20 pts each',
      img: '/illustrations/pad-saturated.svg',
      count: value.pad.saturated,
      desc: 'Full pad soaked through to edges',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Live PBAC Score Meter */}
      <Card
        variant={isAboveThreshold ? 'coral' : 'plumSoft'}
        padding="md"
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Live PBAC Menstrual Score
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-plum/10 text-plum">
              Higham (1990)
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Published threshold is <strong className="text-ink">100 points</strong> (corresponds to &gt;80 mL blood loss per cycle).
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className={`text-3xl font-heading font-bold ${isAboveThreshold ? 'text-coral-dark' : 'text-plum'}`}>
              {currentScore}
            </span>
            <span className="text-sm font-semibold text-ink-subtle ml-1">/ 100</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              isAboveThreshold
                ? 'bg-coral text-white shadow-soft animate-pulse'
                : 'bg-white text-teal border border-teal/30'
            }`}
          >
            {isAboveThreshold ? 'Threshold Reached (≥100)' : 'Below 100'}
          </div>
        </div>
      </Card>

      {/* Visual Pad Selector Grid */}
      <div>
        <h3 className="text-base font-semibold text-ink mb-1">
          1. Sanitary Pads Used During Heaviest Cycle
        </h3>
        <p className="text-xs text-ink-muted mb-4">
          Tap + or - to record how many pads of each saturation level you used throughout your period.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {padOptions.map((opt) => (
            <div
              key={opt.id}
              className={`p-4 rounded-card border bg-white flex flex-col items-center text-center transition-all ${
                opt.count > 0 ? 'border-plum ring-2 ring-plum-soft shadow-soft' : 'border-plum-soft/80'
              }`}
            >
              <div className="h-28 w-20 flex items-center justify-center mb-2">
                <img src={opt.img} alt={opt.name} className="h-full object-contain" />
              </div>

              <h4 className="text-sm font-semibold text-ink">{opt.name}</h4>
              <span className="text-xs text-plum font-medium mb-1">{opt.pts}</span>
              <p className="text-[11px] text-ink-subtle mb-4 h-7">{opt.desc}</p>

              {/* Counter Buttons (at least 48px tap targets) */}
              <div className="flex items-center gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => updatePad(opt.id, -1)}
                  disabled={opt.count === 0}
                  aria-label={`Decrease ${opt.name}`}
                  className="w-11 h-11 rounded-full bg-cream border border-plum-soft text-ink font-bold text-lg flex items-center justify-center hover:bg-plum-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-lg text-ink">
                  {opt.count}
                </span>
                <button
                  type="button"
                  onClick={() => updatePad(opt.id, 1)}
                  aria-label={`Increase ${opt.name}`}
                  className="w-11 h-11 rounded-full bg-plum text-white font-bold text-lg flex items-center justify-center hover:bg-plum-dark transition-colors shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clots & Flooding */}
      <div className="p-4 rounded-card border border-plum-soft bg-white space-y-4">
        <div>
          <h3 className="text-base font-semibold text-ink">
            2. Blood Clots and Flooding Episodes
          </h3>
          <p className="text-xs text-ink-muted">
            Passing clots or sudden flooding through clothes adds to clinical assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Small Clot */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cream/70 border border-plum-soft/60">
            <div>
              <p className="text-xs font-semibold text-ink">Small Clots (&lt; coin)</p>
              <span className="text-[11px] text-plum">1 pt each</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateClot('small', -1)}
                disabled={value.clot.small === 0}
                className="w-9 h-9 rounded-full bg-white border border-plum-soft text-sm font-bold disabled:opacity-30"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold text-sm">{value.clot.small}</span>
              <button
                type="button"
                onClick={() => updateClot('small', 1)}
                className="w-9 h-9 rounded-full bg-plum text-white text-sm font-bold shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Large Clot */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cream/70 border border-plum-soft/60">
            <div>
              <p className="text-xs font-semibold text-ink">Large Clots (≥ coin)</p>
              <span className="text-[11px] text-plum">5 pts each</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateClot('large', -1)}
                disabled={value.clot.large === 0}
                className="w-9 h-9 rounded-full bg-white border border-plum-soft text-sm font-bold disabled:opacity-30"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold text-sm">{value.clot.large}</span>
              <button
                type="button"
                onClick={() => updateClot('large', 1)}
                className="w-9 h-9 rounded-full bg-plum text-white text-sm font-bold shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Flooding */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cream/70 border border-plum-soft/60">
            <div>
              <p className="text-xs font-semibold text-ink">Sudden Flooding</p>
              <span className="text-[11px] text-plum">5 pts per episode</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateFlooding(-1)}
                disabled={value.flooding === 0}
                className="w-9 h-9 rounded-full bg-white border border-plum-soft text-sm font-bold disabled:opacity-30"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold text-sm">{value.flooding}</span>
              <button
                type="button"
                onClick={() => updateFlooding(1)}
                className="w-9 h-9 rounded-full bg-plum text-white text-sm font-bold shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Reference Box */}
      <div className="p-3.5 rounded-xl bg-plum-soft/30 border border-plum/10 text-xs text-ink-muted flex items-start gap-2.5">
        <Info className="w-4 h-4 text-plum flex-shrink-0 mt-0.5" />
        <p>
          Higham et al. (1990) established the PBAC chart. A score of 100+ shows 86% sensitivity and 89% specificity for menstrual blood loss exceeding 80 mL. This is a non-diagnostic screening score intended to be discussed with a doctor.
        </p>
      </div>
    </div>
  );
};
