import type { Profile, Flag, FlagLevel } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export function scoreScreening(profile?: Profile): ScorerOutput {
  const flags: Flag[] = [];
  if (!profile) return { instrumentId: 'screening', flags };

  const guidelines = rules.screening?.guidelines || [];
  const ageBand = profile.ageBand;
  const is30Plus = ageBand === '30-39' || ageBand === '40-49' || ageBand === '50plus' || profile.lifeStage === '40plus';

  if (is30Plus) {
    for (const guide of guidelines) {
      flags.push(
        buildFlag({
          ruleId: guide.id,
          level: guide.level as FlagLevel,
          title: guide.title,
          why: guide.why,
          source: guide.source,
          nextStep: guide.nextStep,
        })
      );
    }
  }

  return { instrumentId: 'screening', flags };
}
