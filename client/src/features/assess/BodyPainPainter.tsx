/**
 * SthreeCare - Body Pain Painter (Stage 6 Stretch Component)
 * Owner: Person A
 * 
 * Interactive body pain mapping tool allowing women to tap and highlight
 * anatomical pain regions (pelvic, sacral, ovarian, radiating) to assess
 * dysmenorrhea and endometriosis clinical patterns.
 */

import React from 'react';
import { Card } from '../../design/ui/Card';
import { Activity, Shield, Info, CheckCircle } from '../../design/ui/Icon';
import type { CycleSymptomInputs } from '@sthreecare/shared';

export interface BodyPainPainterProps {
  symptoms: CycleSymptomInputs;
  onChange: (sym: CycleSymptomInputs) => void;
}

interface PainRegion {
  id: string;
  name: string;
  category: 'anterior' | 'posterior' | 'deep';
  cx: number;
  cy: number;
  r: number;
  clinicalNote: string;
  commonIn: string;
}

const PAIN_REGIONS: PainRegion[] = [
  {
    id: 'pelvic_suprapubic',
    name: 'Lower Pelvic / Suprapubic',
    category: 'anterior',
    cx: 120,
    cy: 220,
    r: 26,
    clinicalNote: 'Central uterine cramping pain commonly observed in primary dysmenorrhea or adenomyosis.',
    commonIn: 'Dysmenorrhea / Adenomyosis',
  },
  {
    id: 'right_iliac',
    name: 'Right Lower Ovarian Fossa',
    category: 'anterior',
    cx: 88,
    cy: 215,
    r: 18,
    clinicalNote: 'Localized right-sided adnexal discomfort; should be clinically evaluated for ovarian cysts or unilateral endometrioma.',
    commonIn: 'Ovarian / Adnexal',
  },
  {
    id: 'left_iliac',
    name: 'Left Lower Ovarian Fossa',
    category: 'anterior',
    cx: 152,
    cy: 215,
    r: 18,
    clinicalNote: 'Localized left-sided adnexal pain; points to unilateral adnexal or deep infiltrating peritoneal implants.',
    commonIn: 'Ovarian / Peritoneal',
  },
  {
    id: 'lower_back_sacral',
    name: 'Lower Sacral & Lumbar Spine',
    category: 'posterior',
    cx: 120,
    cy: 195,
    r: 24,
    clinicalNote: 'Deep sacral and lumbosacral pain radiating from uterosacral ligaments; key indicator for endometriosis screening.',
    commonIn: 'Uterosacral / Endometriosis',
  },
  {
    id: 'deep_pelvic',
    name: 'Deep Internal Pelvic / Dyspareunia',
    category: 'deep',
    cx: 120,
    cy: 245,
    r: 20,
    clinicalNote: 'Deep visceral pain during or after bowel movement or intercourse; strong indicator for pelvic ultrasound evaluation.',
    commonIn: 'Deep Infiltrating Endometriosis',
  },
  {
    id: 'radiating_thigh',
    name: 'Radiating Anterior Thighs',
    category: 'anterior',
    cx: 120,
    cy: 285,
    r: 22,
    clinicalNote: 'Nerve pathway referred pain radiating down the anterior femoral or sciatic distribution during cycle.',
    commonIn: 'Referred Neuropathic Cramping',
  },
];

export const BodyPainPainter: React.FC<BodyPainPainterProps> = ({ symptoms, onChange }) => {
  const selectedLocations = symptoms.painLocations || [];
  const painLevel = symptoms.painLevel ?? 5;
  const disruptiveCycles = symptoms.disruptivePainCycles ?? 0;

  const toggleRegion = (regionId: string) => {
    const isSelected = selectedLocations.includes(regionId);
    const updated = isSelected
      ? selectedLocations.filter((id) => id !== regionId)
      : [...selectedLocations, regionId];

    onChange({
      ...symptoms,
      painLocations: updated,
      // If adding locations and painLevel was 0, set reasonable baseline
      painLevel: updated.length > 0 && painLevel === 0 ? 5 : painLevel,
    });
  };

  const handlePainLevelChange = (lvl: number) => {
    onChange({
      ...symptoms,
      painLevel: lvl,
    });
  };

  const handleDisruptiveCyclesChange = (cycles: number) => {
    onChange({
      ...symptoms,
      disruptivePainCycles: Math.max(0, cycles),
    });
  };

  const clearAll = () => {
    onChange({
      ...symptoms,
      painLocations: [],
    });
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-plum-soft pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-plum-soft flex items-center justify-center text-plum">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-ink">
                Interactive Pelvic & Body Pain Map
              </h3>
            </div>
            <p className="text-xs text-ink-muted">
              Tap the anatomical hotspots on the figure below to map the locations where your cycle pain or pelvic discomfort occurs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              disabled={selectedLocations.length === 0}
              className="text-xs px-3 py-1.5 rounded-full border border-plum-soft text-ink-muted hover:bg-plum-soft/40 disabled:opacity-40 transition-colors"
            >
              Clear Map
            </button>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-plum-soft text-plum">
              {selectedLocations.length} Area{selectedLocations.length === 1 ? '' : 's'} Highlighted
            </span>
          </div>
        </div>

        {/* Interactive Diagram & Regions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Anatomical Silhouette Diagram */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-cream/70 rounded-2xl border border-plum-soft/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle mb-2">
              Tap zones to mark pain hotspots
            </span>

            <div className="relative w-64 h-80 flex items-center justify-center">
              <svg viewBox="0 0 240 340" className="w-full h-full select-none">
                <defs>
                  {/* Subtle Body Gradient */}
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F5ECF3" />
                    <stop offset="100%" stopColor="#EADBEC" />
                  </linearGradient>

                  {/* Pulsing glow filter for active pain hotspots */}
                  <filter id="painGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E4735A" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Torso & Pelvis Anatomical Silhouette Outline */}
                <path
                  d="M 80 20 Q 120 15 160 20 Q 180 50 170 90 Q 185 130 175 170 Q 165 200 155 240 L 150 320 Q 135 325 125 260 L 120 250 L 115 260 Q 105 325 90 320 L 85 240 Q 75 200 65 170 Q 55 130 70 90 Q 60 50 80 20 Z"
                  fill="url(#bodyGradient)"
                  stroke="#6B2D5C"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity="0.85"
                />

                {/* Navel reference mark */}
                <circle cx="120" cy="160" r="3" fill="#6B2D5C" opacity="0.3" />

                {/* Iliac Crest lines */}
                <path d="M 85 180 Q 105 195 120 190" fill="none" stroke="#6B2D5C" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <path d="M 155 180 Q 135 195 120 190" fill="none" stroke="#6B2D5C" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                {/* Interactive Pain Hotspot Circles */}
                {PAIN_REGIONS.map((region) => {
                  const isSelected = selectedLocations.includes(region.id);
                  return (
                    <g
                      key={region.id}
                      onClick={() => toggleRegion(region.id)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      role="button"
                      aria-label={region.name}
                    >
                      {/* Outer pulse wave if active */}
                      {isSelected && (
                        <circle
                          cx={region.cx}
                          cy={region.cy}
                          r={region.r + 6}
                          fill="#E4735A"
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Main hotspot circle */}
                      <circle
                        cx={region.cx}
                        cy={region.cy}
                        r={region.r}
                        fill={isSelected ? '#E4735A' : '#FFFFFF'}
                        stroke={isSelected ? '#B3261E' : '#6B2D5C'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        filter={isSelected ? 'url(#painGlow)' : undefined}
                        opacity={isSelected ? 0.95 : 0.7}
                        className="transition-colors duration-150"
                      />

                      {/* Center symbol */}
                      <text
                        x={region.cx}
                        y={region.cy + 4}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill={isSelected ? '#FFFFFF' : '#6B2D5C'}
                        pointerEvents="none"
                      >
                        {isSelected ? '✓' : '+'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block"></span>
                Active Pain Point
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-plum inline-block"></span>
                Untapped Zone
              </span>
            </div>
          </div>

          {/* Region Details & Clinical Patterns List */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="font-heading font-semibold text-sm text-ink">
              Specific Pain Patterns & Clinical Significance
            </h4>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {PAIN_REGIONS.map((region) => {
                const isSelected = selectedLocations.includes(region.id);
                return (
                  <div
                    key={region.id}
                    onClick={() => toggleRegion(region.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-coral bg-coral-soft/50 ring-1 ring-coral/30 shadow-xs'
                        : 'border-plum-soft/80 bg-white hover:bg-cream/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-coral text-white' : 'bg-plum-soft text-plum'
                          }`}
                        >
                          {isSelected ? '✓' : '+'}
                        </span>
                        <span className="text-xs font-bold text-ink">
                          {region.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white border border-plum/10 text-plum">
                          {region.commonIn}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed pl-7">
                        {region.clinicalNote}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Slider & Recurrent Cycles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-plum-soft">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-ink">Overall Pain Severity Rating</span>
              <span className="font-bold text-plum">{painLevel} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => handlePainLevelChange(parseInt(e.target.value, 10))}
              className="w-full accent-plum h-2 bg-plum-soft rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-subtle">
              <span>0 (No Pain)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe / Debilitating)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-ink">Cycles with Disruptive Pain</span>
              <span className="font-bold text-plum">{disruptiveCycles} Consecutive Cycles</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDisruptiveCyclesChange(disruptiveCycles - 1)}
                className="w-9 h-9 rounded-xl border border-plum-soft bg-white text-ink font-bold hover:bg-plum-soft/40"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-sm text-ink bg-cream py-2 rounded-xl border border-plum-soft/60">
                {disruptiveCycles} {disruptiveCycles === 1 ? 'cycle' : 'cycles'}
              </span>
              <button
                type="button"
                onClick={() => handleDisruptiveCyclesChange(disruptiveCycles + 1)}
                className="w-9 h-9 rounded-xl border border-plum-soft bg-white text-ink font-bold hover:bg-plum-soft/40"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-ink-muted">
              Clinical rules flag for pelvic ultrasound referral when pain causes school/work absence for ≥3 cycles.
            </p>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3 rounded-xl bg-plum-soft/30 border border-plum/10 text-[11px] text-ink-muted flex items-start gap-2">
          <Shield className="w-4 h-4 text-plum flex-shrink-0 mt-0.5" />
          <p>
            Anatomical pain mapping helps localize symptoms for your doctor. Pelvic and sacral pain can have multiple causes including dysmenorrhea, adenomyosis, endometriosis, or pelvic floor tension.
          </p>
        </div>
      </Card>
    </div>
  );
};
