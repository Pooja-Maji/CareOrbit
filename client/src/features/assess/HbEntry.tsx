import React from 'react';
import type { HbInputs } from '@sthreecare/shared';
import { classifyHaemoglobin } from '@sthreecare/compass';
import { Card } from '../../design/ui/Card';
import { Field } from '../../design/ui/Field';
import { Info, Activity } from '../../design/ui/Icon';

export interface HbEntryProps {
  value: HbInputs;
  isPregnant: boolean;
  onChange: (val: HbInputs) => void;
}

export const HbEntry: React.FC<HbEntryProps> = ({ value, isPregnant, onChange }) => {
  const hbNum = value.hbValue;
  const isValidNumber = typeof hbNum === 'number' && !isNaN(hbNum) && hbNum > 0;
  const classification = isValidNumber ? classifyHaemoglobin(hbNum, isPregnant) : null;

  const categoryLabels = {
    normal: { label: 'Normal Range', color: 'text-teal bg-teal-soft border-teal/30' },
    mild: { label: 'Mild Anaemia Range', color: 'text-amber-dark bg-amber-soft border-amber/30' },
    moderate: { label: 'Moderate Anaemia Range', color: 'text-coral-dark bg-coral-soft border-coral/30' },
    severe: { label: 'Severe Anaemia Range', color: 'text-emergency-dark bg-emergency-soft border-emergency/40' },
  };

  const handleHbChange = (valStr: string) => {
    const parsed = parseFloat(valStr);
    onChange({
      ...value,
      hbValue: isNaN(parsed) ? 0 : parsed,
    });
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg" className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-plum" />
            <h3 className="text-lg font-heading font-semibold text-ink">
              Haemoglobin (Hb) Blood Report Entry
            </h3>
          </div>
          <p className="text-xs text-ink-muted">
            Enter the haemoglobin value from your Complete Blood Count (CBC) or lab report in grams per decilitre (g/dL).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Haemoglobin Value"
            type="number"
            step="0.1"
            min="3.0"
            max="22.0"
            placeholder="e.g. 9.8"
            unit="g/dL"
            value={value.hbValue ? value.hbValue : ''}
            onChange={(e) => handleHbChange(e.target.value)}
            hint="Recorded to tenths of g/dL"
          />

          <Field
            label="Date of Lab Report (Optional)"
            type="date"
            value={value.testDate || ''}
            onChange={(e) => onChange({ ...value, testDate: e.target.value })}
          />
        </div>

        {/* Live WHO Category Indicator */}
        {classification && (
          <div className="p-4 rounded-xl border bg-cream/50 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                WHO Reference Category ({isPregnant ? 'Pregnant' : 'Non-Pregnant'})
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  categoryLabels[classification.category].color
                }`}
              >
                {categoryLabels[classification.category].label}
              </span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              According to the World Health Organization table, normal haemoglobin for{' '}
              {isPregnant ? 'pregnant individuals' : 'non-pregnant women'} is{' '}
              <strong className="text-ink">≥ {classification.normalMin} g/dL</strong>. Your recorded value is{' '}
              <strong className="text-ink">{hbNum} g/dL</strong>.
            </p>
          </div>
        )}

        {/* Pre-fill Quick Test Buttons for Demo */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-ink-subtle block mb-2">
            Quick Demo Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleHbChange('9.8')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-plum-soft text-plum hover:bg-plum-soft/80"
            >
              9.8 g/dL (Moderate Anaemia — Plan Demo)
            </button>
            <button
              type="button"
              onClick={() => handleHbChange('11.4')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-soft text-amber-dark hover:bg-amber-soft/80"
            >
              11.4 g/dL (Mild)
            </button>
            <button
              type="button"
              onClick={() => handleHbChange('13.2')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-soft text-teal-dark hover:bg-teal-soft/80"
            >
              13.2 g/dL (Normal)
            </button>
            <button
              type="button"
              onClick={() => handleHbChange('7.2')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emergency-soft text-emergency-dark hover:bg-emergency-soft/80"
            >
              7.2 g/dL (Severe)
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-plum-soft/30 border border-plum/10 text-xs text-ink-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-plum flex-shrink-0 mt-0.5" />
          <p>
            Haemoglobin thresholds are defined by the WHO (2011). Anaemia cut-offs are: Non-pregnant normal ≥ 12.0 g/dL, mild 11.0–11.9, moderate 8.0–10.9, severe &lt; 8.0. Pregnant normal ≥ 11.0 g/dL.
          </p>
        </div>
      </Card>
    </div>
  );
};
