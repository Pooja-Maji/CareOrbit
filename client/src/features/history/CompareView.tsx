/**
 * Care Orbit - Multi-Cycle Compare View (Stretch)
 * Owner: Person B (Stage 9)
 * 
 * Side-by-side comparative analysis of two screening results to assess
 * clinical treatment progress or worsening menorrhagia.
 */

import React, { useState } from 'react';
import type { Result } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Activity, ArrowRight, CheckCircle } from '../../design/ui/Icon';

interface CompareViewProps {
  results: Result[];
}

export const CompareView: React.FC<CompareViewProps> = ({ results }) => {
  if (results.length < 2) {
    return (
      <Card variant="default" padding="md" className="text-center py-6 border border-plum-soft">
        <p className="text-xs text-ink-muted">
          Compare view requires at least two recorded checks.
        </p>
      </Card>
    );
  }

  const [idA, setIdA] = useState(results[0]?.id || '');
  const [idB, setIdB] = useState(results[1]?.id || '');

  const resA = results.find((r) => r.id === idA) || results[0];
  const resB = results.find((r) => r.id === idB) || results[1];

  const pbacA = (resA.scores?.['pbac'] as number) || 0;
  const pbacB = (resB.scores?.['pbac'] as number) || 0;
  const pbacDelta = pbacB - pbacA;

  const hbA = (resA.scores?.['hb'] as number) || 0;
  const hbB = (resB.scores?.['hb'] as number) || 0;
  const hbDelta = hbB - hbA;

  return (
    <Card variant="default" padding="lg" className="space-y-6 border border-plum-soft shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-plum-soft pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-ink">
            Side-by-Side Health Check Comparison
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Compare changes in bleeding volume and haemoglobin across cycles
          </p>
        </div>

        {/* Pickers */}
        <div className="flex items-center gap-2">
          <select
            value={idA}
            onChange={(e) => setIdA(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-plum-soft bg-white text-ink font-medium"
          >
            {results.map((r) => (
              <option key={r.id} value={r.id}>
                Baseline: {r.date} ({r.scores['pbac'] ? `PBAC ${r.scores['pbac']}` : 'Check'})
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-plum">vs</span>

          <select
            value={idB}
            onChange={(e) => setIdB(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-plum-soft bg-white text-ink font-medium"
          >
            {results.map((r) => (
              <option key={r.id} value={r.id}>
                Follow-up: {r.date} ({r.scores['pbac'] ? `PBAC ${r.scores['pbac']}` : 'Check'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PBAC Bleeding Comparison */}
        <div className="p-4 rounded-xl bg-cream/70 border border-plum-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Menstrual Flow Score (PBAC)
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                pbacDelta > 0
                  ? 'bg-coral-soft text-coral'
                  : pbacDelta < 0
                  ? 'bg-teal-soft text-teal'
                  : 'bg-black/5 text-ink-muted'
              }`}
            >
              {pbacDelta > 0 ? `+${pbacDelta} (Increased)` : pbacDelta < 0 ? `${pbacDelta} (Reduced)` : 'No change'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white rounded-lg border border-plum-soft/40">
              <span className="text-[11px] text-ink-muted block">{resA.date}</span>
              <span className="text-xl font-heading font-bold text-ink">{pbacA || 'N/A'}</span>
              <span className="text-[10px] text-ink-subtle block">Threshold: 100</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-plum-soft/40">
              <span className="text-[11px] text-ink-muted block">{resB.date}</span>
              <span className="text-xl font-heading font-bold text-ink">{pbacB || 'N/A'}</span>
              <span className="text-[10px] text-ink-subtle block">Threshold: 100</span>
            </div>
          </div>
        </div>

        {/* Hb Haemoglobin Comparison */}
        <div className="p-4 rounded-xl bg-cream/70 border border-plum-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Haemoglobin (Hb Lab Value)
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hbDelta > 0
                  ? 'bg-teal-soft text-teal'
                  : hbDelta < 0
                  ? 'bg-coral-soft text-coral'
                  : 'bg-black/5 text-ink-muted'
              }`}
            >
              {hbDelta > 0 ? `+${hbDelta.toFixed(1)} g/dL (Improved)` : hbDelta < 0 ? `${hbDelta.toFixed(1)} g/dL (Declined)` : 'No change'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white rounded-lg border border-plum-soft/40">
              <span className="text-[11px] text-ink-muted block">{resA.date}</span>
              <span className="text-xl font-heading font-bold text-ink">
                {hbA ? `${hbA} g/dL` : 'Not recorded'}
              </span>
              <span className="text-[10px] text-ink-subtle block">Cut-off: 12.0</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-plum-soft/40">
              <span className="text-[11px] text-ink-muted block">{resB.date}</span>
              <span className="text-xl font-heading font-bold text-ink">
                {hbB ? `${hbB} g/dL` : 'Not recorded'}
              </span>
              <span className="text-[10px] text-ink-subtle block">Cut-off: 12.0</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
