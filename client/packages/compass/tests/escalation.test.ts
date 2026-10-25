/**
 * SthreeCare - Escalation Scorer Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scoreEscalation } from '../src/scorers/escalation';
import type { Profile } from '@sthreecare/shared';

describe('Escalation Scorer', () => {
  const baseProfile: Profile = {
    id: 'user_1',
    ageBand: '20-29',
    lifeStage: 'adult',
    isPregnant: false,
    isPostpartum: false,
    history: {},
    consent: { dataStaysOnDevice: true, termsAccepted: true, consentTimestamp: '' },
    createdAt: '',
    updatedAt: '',
  };

  it('flags recurrent heavy bleeding when heavyBleedingCycles >= 3', () => {
    const output = scoreEscalation(
      { heavyBleedingCycles: 3, disruptivePainCycles: 0, painLevel: 2 },
      baseProfile
    );

    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('escalate_recurrent_heavy_bleeding');
    expect(output.flags[0].level).toBe('discuss');
  });

  it('flags disruptive pelvic pain when painCycles >= 3', () => {
    const output = scoreEscalation(
      { heavyBleedingCycles: 0, disruptivePainCycles: 3, painLevel: 5 },
      baseProfile
    );

    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('escalate_disruptive_pelvic_pain');
    expect(output.flags[0].level).toBe('discuss');
  });

  it('flags disruptive pelvic pain when painLevel >= 7', () => {
    const output = scoreEscalation(
      { heavyBleedingCycles: 0, disruptivePainCycles: 1, painLevel: 8 },
      baseProfile
    );

    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('escalate_disruptive_pelvic_pain');
  });

  it('triggers both escalation rules if both criteria are met', () => {
    const output = scoreEscalation(
      { heavyBleedingCycles: 3, disruptivePainCycles: 3, painLevel: 8 },
      baseProfile
    );

    expect(output.flags).toHaveLength(2);
    expect(output.flags.map((f) => f.ruleId)).toContain('escalate_recurrent_heavy_bleeding');
    expect(output.flags.map((f) => f.ruleId)).toContain('escalate_disruptive_pelvic_pain');
  });

  it('returns no escalation flags if cycles are below threshold', () => {
    const output = scoreEscalation(
      { heavyBleedingCycles: 1, disruptivePainCycles: 1, painLevel: 4 },
      baseProfile
    );

    expect(output.flags).toHaveLength(0);
  });
});
