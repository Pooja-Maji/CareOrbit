import type { AssessmentInputs, Profile, Flag } from '@sthreecare/shared';
import { calculatePbacScore } from './scorers/pbac';
import { classifyHaemoglobin } from './scorers/hb';
import { buildFlag } from './flagBuilder';
import { rules } from './ruleLoader';

export function evaluateConnectors(
  inputs: AssessmentInputs,
  profile?: Profile,
  pbacScore?: number
): Flag[] {
  const flags: Flag[] = [];

  // Check 1: Heavy Bleeding + Low Haemoglobin Connector
  const isPregnant = profile?.isPregnant || false;
  const currentPbac = typeof pbacScore === 'number' ? pbacScore : inputs.pbac ? calculatePbacScore(inputs.pbac) : 0;
  const recurrentCycles = profile?.history?.cyclesOver100PbacCount || inputs.symptoms?.heavyBleedingCycles || 0;
  const hasHeavyBleeding = currentPbac >= 100 || recurrentCycles >= 1;

  if (hasHeavyBleeding && inputs.hb && typeof inputs.hb.hbValue === 'number') {
    const hbVal = inputs.hb.hbValue;
    const { category } = classifyHaemoglobin(hbVal, isPregnant);

    if (category !== 'normal') {
      const cycleInfo = recurrentCycles >= 3
        ? 'has been elevated for 3 or more cycles'
        : `current score is ${currentPbac} (threshold ≥ 100)`;

      flags.push(
        buildFlag({
          ruleId: 'connector_heavy_bleeding_anaemia',
          level: 'discuss',
          title: 'Connected Finding: Heavy Menstrual Flow & Low Haemoglobin',
          why: `Your PBAC bleeding score ${cycleInfo}, and your recorded haemoglobin is ${hbVal} g/dL (${category} anaemia range). Together, these findings suggest that ongoing menstrual blood loss may be contributing to depleted iron reserves. This is a pattern observation for clinical discussion, not proof of cause.`,
          source: 'WHO Anaemia Guidelines & Higham et al. 1990 Connected Evaluation',
          nextStep: 'Please discuss this connection with a doctor. Consider asking for a complete blood count (CBC) with serum ferritin test, and discuss investigating the underlying cause of heavy menstrual bleeding.',
        })
      );
    }
  }

  return flags;
}
