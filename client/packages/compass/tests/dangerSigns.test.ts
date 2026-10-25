/**
 * SthreeCare - Danger Signs Scorer Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scoreDangerSigns } from '../src/scorers/dangerSigns';

describe('Danger Signs Scorer', () => {
  it('returns no flags if no danger signs are checked', () => {
    const output = scoreDangerSigns({ selectedSigns: [] });
    expect(output.flags).toHaveLength(0);
  });

  it('triggers urgent red-flag for soaking rate exceeding 2 pads/hour', () => {
    const output = scoreDangerSigns({ selectedSigns: ['danger_soaking_rate'] });
    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].level).toBe('urgent');
    expect(output.flags[0].ruleId).toBe('danger_soaking_rate');
    expect(output.flags[0].nextStep).toContain('108');
  });

  it('triggers urgent red-flag for syncope or dizziness while bleeding', () => {
    const output = scoreDangerSigns({ selectedSigns: ['danger_fainting_dizziness'] });
    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].level).toBe('urgent');
    expect(output.flags[0].ruleId).toBe('danger_fainting_dizziness');
  });

  it('triggers multiple flags when multiple danger signs are checked', () => {
    const output = scoreDangerSigns({
      selectedSigns: ['danger_soaking_rate', 'danger_severe_abdominal_pain'],
    });
    expect(output.flags).toHaveLength(2);
    expect(output.flags.every((f) => f.level === 'urgent')).toBe(true);
  });
});
