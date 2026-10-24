import type { PbacInputs, Flag } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export function calculatePbacScore(input: PbacInputs): number {
  const pbacRule = rules.pbac;
  const items = pbacRule.items;

  const padScore =
    (input.pad?.light || 0) * items.pad.light +
    (input.pad?.moderate || 0) * items.pad.moderate +
    (input.pad?.saturated || 0) * items.pad.saturated;

  const tamponScore =
    (input.tampon?.light || 0) * items.tampon.light +
    (input.tampon?.moderate || 0) * items.tampon.moderate +
    (input.tampon?.saturated || 0) * items.tampon.saturated;

  const clotScore =
    (input.clot?.small || 0) * items.clot.small +
    (input.clot?.large || 0) * items.clot.large;

  const floodingScore = (input.flooding || 0) * items.flooding;

  return padScore + tamponScore + clotScore + floodingScore;
}

export function scorePbac(input?: PbacInputs): ScorerOutput {
  const flags: Flag[] = [];
  if (!input) {
    return { instrumentId: 'pbac', score: 0, flags };
  }

  const score = calculatePbacScore(input);
  const pbacRule = rules.pbac;
  const threshold = pbacRule.threshold || 100;

  if (score >= threshold) {
    flags.push(
      buildFlag({
        ruleId: 'pbac_menorrhagia',
        level: 'discuss',
        title: 'Elevated Menstrual Flow Score (PBAC ≥ 100)',
        why: `Your calculated PBAC score is ${score}, which meets the published screening threshold of 100 points (roughly equivalent to 80 mL blood loss per cycle). This is a screening score and does not diagnose an underlying condition.`,
        source: `${pbacRule.source} (${pbacRule.clinical_review_status})`,
        nextStep: 'Share this bleeding score with your healthcare provider and discuss testing your haemoglobin and serum ferritin levels.',
      })
    );
  }

  return {
    instrumentId: 'pbac',
    score,
    flags,
  };
}
