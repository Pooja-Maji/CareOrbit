import React from 'react';
import type { LifeStage } from '@sthreecare/shared';
import { Chip } from '../../design/ui/Chip';
import { COPY } from '../../copy';

export interface LifeStageChipsProps {
  selectedStage: LifeStage;
  onSelectStage: (stage: LifeStage) => void;
}

export const LifeStageChips: React.FC<LifeStageChipsProps> = ({
  selectedStage,
  onSelectStage,
}) => {
  const stages: { id: LifeStage; label: string; span: string }[] = [
    { id: 'teen', label: COPY.lifeStages.teen.label, span: COPY.lifeStages.teen.ageSpan },
    { id: 'adult', label: COPY.lifeStages.adult.label, span: COPY.lifeStages.adult.ageSpan },
    { id: 'pregnant', label: COPY.lifeStages.pregnant.label, span: COPY.lifeStages.pregnant.ageSpan },
    { id: 'postpartum', label: COPY.lifeStages.postpartum.label, span: COPY.lifeStages.postpartum.ageSpan },
    { id: '40plus', label: COPY.lifeStages['40plus'].label, span: COPY.lifeStages['40plus'].ageSpan },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {stages.map((st) => (
          <Chip
            key={st.id}
            active={selectedStage === st.id}
            variant={selectedStage === st.id ? 'plum' : 'neutral'}
            onClick={() => onSelectStage(st.id)}
            className="text-xs sm:text-sm"
          >
            {st.label}
          </Chip>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-plum-soft/40 border border-plum/10 text-xs text-ink-muted">
        <strong className="text-plum font-semibold block mb-0.5">
          {COPY.lifeStages[selectedStage]?.label} ({COPY.lifeStages[selectedStage]?.ageSpan})
        </strong>
        {COPY.lifeStages[selectedStage]?.desc}
      </div>
    </div>
  );
};
