import type { HbInputs, Flag } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export type AnaemiaCategory = 'normal' | 'mild' | 'moderate' | 'severe';

export function classifyHaemoglobin(hbValue: number, isPregnant: boolean): { category: AnaemiaCategory; normalMin: number } {
  const hbRule = rules.hb;
  const group = isPregnant ? hbRule.groups.pregnant : hbRule.groups.non_pregnant;

  // Round to 1 decimal place (tenths of g/dL)
  const val = Math.round(hbValue * 10) / 10;

  if (val >= group.normal_min) {
    return { category: 'normal', normalMin: group.normal_min };
  }
  if (val >= group.mild[0] && val <= group.mild[1]) {
    return { category: 'mild', normalMin: group.normal_min };
  }
  if (val >= group.moderate[0] && val <= group.moderate[1]) {
    return { category: 'moderate', normalMin: group.normal_min };
  }
  return { category: 'severe', normalMin: group.normal_min };
}

export function scoreHb(input?: HbInputs, isPregnant: boolean = false): ScorerOutput {
  const flags: Flag[] = [];
  if (!input || typeof input.hbValue !== 'number' || isNaN(input.hbValue)) {
    return { instrumentId: 'hb', flags };
  }

  const { category, normalMin } = classifyHaemoglobin(input.hbValue, isPregnant);
  const hbRule = rules.hb;
  const statusLabel = isPregnant ? 'pregnant' : 'non-pregnant';

  if (category === 'severe') {
    flags.push(
      buildFlag({
        ruleId: 'hb_severe_anaemia',
        level: 'urgent',
        title: `Severe Anaemia Indication (Hb ${input.hbValue} g/dL)`,
        why: `Your haemoglobin of ${input.hbValue} g/dL is below the severe anaemia cut-off (${isPregnant ? '< 7.0' : '< 8.0'} g/dL for ${statusLabel} individuals). This requires prompt medical attention.`,
        source: `${hbRule.source} (${hbRule.title})`,
        nextStep: 'Contact your healthcare provider or visit a medical facility promptly for immediate clinical assessment.',
      })
    );
  } else if (category === 'moderate') {
    flags.push(
      buildFlag({
        ruleId: 'hb_moderate_anaemia',
        level: 'discuss',
        title: `Moderate Anaemia Range (Hb ${input.hbValue} g/dL)`,
        why: `Your recorded haemoglobin of ${input.hbValue} g/dL falls within the WHO moderate anaemia category (${isPregnant ? '7.0–9.9' : '8.0–10.9'} g/dL). This is a screening finding, not a clinical diagnosis.`,
        source: hbRule.source,
        nextStep: 'Schedule a visit with a doctor to discuss potential iron deficiency, nutritional support, or further diagnostic workup.',
      })
    );
  } else if (category === 'mild') {
    flags.push(
      buildFlag({
        ruleId: 'hb_mild_anaemia',
        level: 'discuss',
        title: `Mild Anaemia Range (Hb ${input.hbValue} g/dL)`,
        why: `Your haemoglobin is ${input.hbValue} g/dL (normal threshold is ${normalMin} g/dL for ${statusLabel} women).`,
        source: hbRule.source,
        nextStep: 'Discuss dietary iron intake, iron-rich foods, and whether supplementation is appropriate with your doctor.',
      })
    );
  }

  return {
    instrumentId: 'hb',
    score: input.hbValue,
    category,
    flags,
    isUrgentEmergency: category === 'severe',
  };
}
