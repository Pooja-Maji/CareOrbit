import type { Profile, CycleSymptomInputs, Flag, FlagLevel } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export function scoreEscalation(symptoms?: CycleSymptomInputs, profile?: Profile): ScorerOutput {
  const flags: Flag[] = [];
  const escalationRules = rules.escalation?.rules || [];

  const cyclesHeavy = symptoms?.heavyBleedingCycles || profile?.history?.cyclesOver100PbacCount || 0;
  if (cyclesHeavy >= 3) {
    const heavyRule = escalationRules.find((r: any) => r.id === 'escalate_recurrent_heavy_bleeding');
    if (heavyRule) {
      flags.push(
        buildFlag({
          ruleId: heavyRule.id,
          level: heavyRule.level as FlagLevel,
          title: heavyRule.title,
          why: heavyRule.why,
          source: heavyRule.source,
          nextStep: heavyRule.nextStep,
        })
      );
    }
  }

  const painCycles = symptoms?.disruptivePainCycles || 0;
  const painLevel = symptoms?.painLevel || 0;
  if (painCycles >= 3 || painLevel >= 7) {
    const painRule = escalationRules.find((r: any) => r.id === 'escalate_disruptive_pelvic_pain');
    if (painRule) {
      flags.push(
        buildFlag({
          ruleId: painRule.id,
          level: painRule.level as FlagLevel,
          title: painRule.title,
          why: painRule.why,
          source: painRule.source,
          nextStep: painRule.nextStep,
        })
      );
    }
  }

  return {
    instrumentId: 'escalation',
    flags,
  };
}
