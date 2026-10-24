import React from 'react';
import type { ProfileHistory } from '@sthreecare/shared';
import { Field } from '../../design/ui/Field';

export interface HistoryIntakeProps {
  history: ProfileHistory;
  onChange: (history: ProfileHistory) => void;
}

export const HistoryIntake: React.FC<HistoryIntakeProps> = ({
  history,
  onChange,
}) => {
  const handleToggle = (key: keyof ProfileHistory) => {
    onChange({
      ...history,
      [key]: !history[key],
    });
  };

  const handleCycleCountChange = (val: string) => {
    const num = parseInt(val, 10);
    onChange({
      ...history,
      cyclesOver100PbacCount: isNaN(num) ? 0 : Math.max(0, num),
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-ink">
        Reproductive & Health History (Optional)
      </h3>
      <p className="text-xs text-ink-muted">
        Sharing context helps the Compass link multi-cycle trends like recurring heavy flow.
      </p>

      <div className="space-y-3">
        <Field
          label="Consecutive Cycles with Heavy Bleeding"
          type="number"
          min="0"
          max="24"
          value={history.cyclesOver100PbacCount ?? 0}
          onChange={(e) => handleCycleCountChange(e.target.value)}
          unit="cycles"
          hint="If bleeding has been unusually heavy for 3+ cycles, the Compass flags this for review."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-plum-soft bg-white hover:bg-plum-soft/20 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={Boolean(history.priorAnaemiaDiagnosis)}
              onChange={() => handleToggle('priorAnaemiaDiagnosis')}
              className="w-4 h-4 text-plum rounded focus:ring-plum"
            />
            <span className="text-xs font-medium text-ink">
              Prior diagnosis of anaemia or low iron
            </span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-plum-soft bg-white hover:bg-plum-soft/20 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={Boolean(history.hadUltrasound)}
              onChange={() => handleToggle('hadUltrasound')}
              className="w-4 h-4 text-plum rounded focus:ring-plum"
            />
            <span className="text-xs font-medium text-ink">
              Pelvic ultrasound within the past 12 months
            </span>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-plum-soft bg-white hover:bg-plum-soft/20 cursor-pointer transition-colors sm:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(history.familyHistoryEndometriosis)}
              onChange={() => handleToggle('familyHistoryEndometriosis')}
              className="w-4 h-4 text-plum rounded focus:ring-plum"
            />
            <span className="text-xs font-medium text-ink">
              Family history of severe period pain, endometriosis, or fibroids
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
