import type { DangerSignsInputs, Flag } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export function scoreDangerSigns(input?: DangerSignsInputs): ScorerOutput {
  const flags: Flag[] = [];
  if (!input || !input.selectedSigns || input.selectedSigns.length === 0) {
    return { instrumentId: 'danger_signs', score: 0, flags, isUrgentEmergency: false };
  }

  const dangerRule = rules.dangerSigns;
  const matched = dangerRule.items.filter((item: any) =>
    input.selectedSigns.includes(item.id)
  );

  if (matched.length > 0) {
    for (const item of matched) {
      flags.push(
        buildFlag({
          ruleId: item.id,
          level: 'urgent',
          title: `Urgent Warning Sign: ${item.text}`,
          why: 'This clinical symptom indicates an urgent situation requiring immediate medical evaluation.',
          source: dangerRule.source,
          nextStep: 'Seek emergency medical evaluation immediately. Call 108 or proceed to the nearest hospital emergency department.',
        })
      );
    }
    return {
      instrumentId: 'danger_signs',
      score: matched.length,
      flags,
      isUrgentEmergency: true,
    };
  }

  return { instrumentId: 'danger_signs', score: 0, flags, isUrgentEmergency: false };
}
