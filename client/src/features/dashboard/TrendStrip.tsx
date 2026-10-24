/**
 * SthreeCare - Trend Strip
 * Owner: Person B (Stage 4)
 * 
 * Signature visual: Sparklines of Menstrual Bleeding Score (PBAC) and
 * Haemoglobin (Hb) plotted against published clinical threshold lines.
 */

import React from 'react';
import { Card } from '../../design/ui/Card';
import { Activity, Info } from '../../design/ui/Icon';
import type { Result } from '@sthreecare/shared';

interface TrendStripProps {
  history: Result[];
  isPregnant?: boolean;
}

export const TrendStrip: React.FC<TrendStripProps> = ({ history, isPregnant = false }) => {
  // Extract chronological data points (oldest to newest for sparkline)
  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const pbacPoints = sorted
    .filter((r) => typeof r.scores?.['pbac'] === 'number')
    .map((r) => ({
      date: r.date,
      val: r.scores['pbac'] as number,
    }));

  const hbPoints = sorted
    .filter((r) => typeof r.scores?.['hb'] === 'number')
    .map((r) => ({
      date: r.date,
      val: r.scores['hb'] as number,
    }));

  const hbThreshold = isPregnant ? 11.0 : 12.0;
  const pbacThreshold = 100;

  return (
    <Card variant="default" padding="md" className="space-y-4 border border-plum-soft shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-plum" />
          <h3 className="font-heading font-semibold text-base text-ink">
            Longitudinal Health Trends
          </h3>
        </div>
        <span className="text-[11px] text-ink-subtle">
          Dashed lines represent validated clinical screening cut-offs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PBAC Bleeding Sparkline */}
        <div className="p-4 rounded-xl bg-cream/60 border border-plum-soft/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Bleeding Score (PBAC)
            </span>
            <span className="text-[11px] text-coral font-medium">
              Threshold: &gt;100 pts
            </span>
          </div>

          {pbacPoints.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-xs text-ink-muted">
              Log at least one period check to view trend
            </div>
          ) : (
            <div className="space-y-1">
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                {/* Threshold line at 100 */}
                {/* Scale: min 0, max 250 -> y = 80 - (val / 250) * 75 */}
                {(() => {
                  const maxVal = Math.max(250, ...pbacPoints.map((p) => p.val));
                  const thresholdY = 75 - (pbacThreshold / maxVal) * 65;

                  // Compute coords
                  const coords = pbacPoints.map((pt, idx) => {
                    const x =
                      pbacPoints.length === 1
                        ? 150
                        : 20 + (idx / (pbacPoints.length - 1)) * 260;
                    const y = 75 - (pt.val / maxVal) * 65;
                    return { x, y, pt };
                  });

                  const pathStr = coords
                    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`)
                    .join(' ');

                  return (
                    <>
                      {/* Grid background */}
                      <line
                        x1="10"
                        y1={thresholdY}
                        x2="290"
                        y2={thresholdY}
                        stroke="#E4735A"
                        strokeDasharray="4 3"
                        strokeWidth="1.5"
                      />
                      <text
                        x="292"
                        y={thresholdY + 3}
                        fill="#E4735A"
                        fontSize="9"
                        textAnchor="start"
                      >
                        100
                      </text>

                      {/* Area fill */}
                      {coords.length > 1 && (
                        <path
                          d={`${pathStr} L ${coords[coords.length - 1].x} 75 L ${coords[0].x} 75 Z`}
                          fill="rgba(107, 45, 92, 0.08)"
                        />
                      )}

                      {/* Line */}
                      <path
                        d={pathStr}
                        fill="none"
                        stroke="#6B2D5C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {coords.map((c, i) => (
                        <g key={i}>
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r="4.5"
                            fill={c.pt.val >= pbacThreshold ? '#E4735A' : '#6B2D5C'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                          <text
                            x={c.x}
                            y={c.y - 8}
                            fill="#241B22"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {c.pt.val}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] text-ink-subtle px-1">
                {pbacPoints.map((p, idx) => (
                  <span key={idx}>Cycle {idx + 1}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hb Anaemia Sparkline */}
        <div className="p-4 rounded-xl bg-cream/60 border border-plum-soft/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Haemoglobin (Hb) Lab Trend
            </span>
            <span className="text-[11px] text-teal font-medium">
              Cut-off: &lt;{hbThreshold} g/dL
            </span>
          </div>

          {hbPoints.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-xs text-ink-muted">
              Enter a lab report Hb value to track anaemia progress
            </div>
          ) : (
            <div className="space-y-1">
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                {(() => {
                  const maxHb = 16;
                  const minHb = 6;
                  const thresholdY = 75 - ((hbThreshold - minHb) / (maxHb - minHb)) * 65;

                  const coords = hbPoints.map((pt, idx) => {
                    const x =
                      hbPoints.length === 1
                        ? 150
                        : 20 + (idx / (hbPoints.length - 1)) * 260;
                    const y = 75 - ((pt.val - minHb) / (maxHb - minHb)) * 65;
                    return { x, y, pt };
                  });

                  const pathStr = coords
                    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`)
                    .join(' ');

                  return (
                    <>
                      {/* WHO cut-off line */}
                      <line
                        x1="10"
                        y1={thresholdY}
                        x2="290"
                        y2={thresholdY}
                        stroke="#1F6F6B"
                        strokeDasharray="4 3"
                        strokeWidth="1.5"
                      />
                      <text
                        x="292"
                        y={thresholdY + 3}
                        fill="#1F6F6B"
                        fontSize="9"
                        textAnchor="start"
                      >
                        {hbThreshold}
                      </text>

                      {/* Line */}
                      <path
                        d={pathStr}
                        fill="none"
                        stroke="#1F6F6B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {coords.map((c, i) => (
                        <g key={i}>
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r="4.5"
                            fill={c.pt.val < hbThreshold ? '#E4735A' : '#1F6F6B'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                          <text
                            x={c.x}
                            y={c.y - 8}
                            fill="#241B22"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {c.pt.val} g/dL
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] text-ink-subtle px-1">
                {hbPoints.map((p, idx) => (
                  <span key={idx}>{p.date}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {pbacPoints.length >= 3 && hbPoints.length > 0 && (
        <div className="p-3 rounded-lg bg-plum-soft/40 border border-plum/20 flex items-start gap-2 text-xs text-ink leading-relaxed">
          <Info className="w-4 h-4 text-plum flex-shrink-0 mt-0.5" />
          <p>
            <strong>Compass Engine Correlation:</strong> Repeated monthly PBAC scores &gt;100 combined with low haemoglobin indicate chronic blood loss is the probable contributing factor to iron deficiency. Bring this chart to your clinician.
          </p>
        </div>
      )}
    </Card>
  );
};
