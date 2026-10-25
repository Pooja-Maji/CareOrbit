/**
 * SthreeCare - EPDS Scorer Unit Tests (Cox 1987 validation)
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scoreEpds } from '../src/scorers/epds';

describe('EPDS Scorer', () => {
  it('calculates score correctly and flags when threshold >= 13', () => {
    // 10 answers summing to 14
    const answers = [2, 2, 2, 2, 2, 1, 1, 1, 1, 0];
    const output = scoreEpds({ answers });

    expect(output.score).toBe(14);
    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('epds_elevated_depression_risk');
    expect(output.flags[0].level).toBe('discuss');
    expect(output.flags[0].source).toContain('Cox');
  });

  it('does not flag elevated depression risk when score is below 13 and item 10 is 0', () => {
    const answers = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0]; // Sum = 6
    const output = scoreEpds({ answers });

    expect(output.score).toBe(6);
    expect(output.flags).toHaveLength(0);
  });

  it('triggers immediate urgent crisis flag when item 10 is positive (self-harm risk)', () => {
    // Item 10 has score > 0 (e.g. 1) even if total score is below 13
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2]; // Sum = 2, item 10 is 2
    const output = scoreEpds({ answers });

    expect(output.score).toBe(2);
    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('epds_self_harm_risk');
    expect(output.flags[0].level).toBe('urgent');
    expect(output.flags[0].nextStep).toContain('14416');
  });

  it('triggers both elevated risk flag and urgent self-harm flag if score >= 13 and item 10 > 0', () => {
    const answers = [2, 2, 2, 2, 2, 1, 1, 1, 1, 1]; // Sum = 15, item 10 is 1
    const output = scoreEpds({ answers });

    expect(output.score).toBe(15);
    expect(output.flags.length).toBeGreaterThanOrEqual(2);
    const selfHarmFlag = output.flags.find((f) => f.ruleId === 'epds_self_harm_risk');
    const elevatedFlag = output.flags.find((f) => f.ruleId === 'epds_elevated_depression_risk');
    expect(selfHarmFlag?.level).toBe('urgent');
    expect(elevatedFlag?.level).toBe('discuss');
  });
});
