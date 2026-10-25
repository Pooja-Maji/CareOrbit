import React from 'react';
import type { CycleSymptomInputs, DangerSignsInputs } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Field } from '../../design/ui/Field';
import { AlertTriangle } from '../../design/ui/Icon';

export interface SymptomLogProps {
  symptoms: CycleSymptomInputs;
  dangerSigns: DangerSignsInputs;
  onSymptomsChange: (sym: CycleSymptomInputs) => void;
  onDangerSignsChange: (ds: DangerSignsInputs) => void;
}

export const SymptomLog: React.FC<SymptomLogProps> = ({
  symptoms,
  dangerSigns,
  onSymptomsChange,
  onDangerSignsChange,
}) => {
  const painLevel = symptoms.painLevel ?? 5;

  const dangerOptions = [
    {
      id: 'danger_soaking_rate',
      label: 'Soaking through 2+ large pads/tampons per hour for 2+ consecutive hours',
    },
    {
      id: 'danger_fainting_dizziness',
      label: 'Severe dizziness, fainting, clammy cold skin, or breathlessness while bleeding',
    },
    {
      id: 'danger_severe_abdominal_pain',
      label: 'Sudden, excruciating lower pelvic pain that makes it difficult to stand upright',
    },
    {
      id: 'danger_fever_pelvic',
      label: 'High fever (> 101°F) combined with severe pelvic pain or foul-smelling discharge',
    },
  ];

  const handleToggleDanger = (id: string) => {
    const current = dangerSigns.selectedSigns || [];
    const next = current.includes(id) ? current.filter((s) => s !== id) : [...current, id];
    onDangerSignsChange({ selectedSigns: next });
  };

  return (
    <div className="space-y-6">
      {/* Urgent Warning Signs Section */}
      <Card variant="emergency" padding="md" className="space-y-3">
        <div className="flex items-center gap-2 text-emergency-dark font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-emergency" />
          <span>Danger signs</span>
        </div>
        <p className="text-xs text-ink-muted">
          Tick any that apply right now. We'll point you to emergency care.
        </p>

        <div className="space-y-2 pt-1">
          {dangerOptions.map((opt) => {
            const checked = (dangerSigns.selectedSigns || []).includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                  checked
                    ? 'bg-emergency/10 border-emergency text-ink font-semibold ring-2 ring-emergency/20'
                    : 'bg-white border-emergency/30 text-ink-muted hover:bg-emergency-soft/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleDanger(opt.id)}
                  className="mt-1 w-4 h-4 text-emergency rounded focus:ring-emergency"
                />
                <span className="text-xs leading-relaxed">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </Card>

      {/* Cycle & Pain Logging */}
      <Card variant="default" padding="lg" className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-ink">Cycle & pain</h3>
          <p className="text-xs text-ink-muted">
            Helps your doctor see the full picture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Average Cycle Length"
            type="number"
            min="15"
            max="60"
            value={symptoms.cycleLengthDays ?? 28}
            onChange={(e) =>
              onSymptomsChange({ ...symptoms, cycleLengthDays: parseInt(e.target.value, 10) || 28 })
            }
            unit="days"
            hint="Normal range is typically 21–35 days."
          />

          <Field
            label="Typical Period Duration"
            type="number"
            min="1"
            max="14"
            value={symptoms.periodDurationDays ?? 5}
            onChange={(e) =>
              onSymptomsChange({ ...symptoms, periodDurationDays: parseInt(e.target.value, 10) || 5 })
            }
            unit="days"
            hint="Bleeding for more than 7 days is considered prolonged."
          />
        </div>

        {/* 0-10 Pain Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-ink">
              Worst Menstrual Pain Severity (0–10 Scale)
            </label>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                painLevel >= 7
                  ? 'bg-coral text-white'
                  : painLevel >= 4
                  ? 'bg-amber text-white'
                  : 'bg-teal text-white'
              }`}
            >
              {painLevel} / 10 {painLevel >= 7 ? '(Severe)' : painLevel >= 4 ? '(Moderate)' : '(Mild)'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) =>
              onSymptomsChange({ ...symptoms, painLevel: parseInt(e.target.value, 10) || 0 })
            }
            className="w-full accent-plum h-2 bg-plum-soft rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-ink-subtle">
            <span>0: No pain</span>
            <span>5: Moderate cramping</span>
            <span>10: Incapacitating pain</span>
          </div>
        </div>

        {/* Disruptive Pain Cycles */}
        <div className="pt-2">
          <Field
            label="Consecutive Cycles with Disruptive Pain"
            type="number"
            min="0"
            max="24"
            value={symptoms.disruptivePainCycles ?? 0}
            onChange={(e) =>
              onSymptomsChange({
                ...symptoms,
                disruptivePainCycles: parseInt(e.target.value, 10) || 0,
              })
            }
            unit="cycles"
            hint="Cycles where pain prevented going to school, work, or carrying out daily tasks."
          />
        </div>
      </Card>
    </div>
  );
};
