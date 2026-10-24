import { describe, it, expect } from 'vitest';
import { run } from '../src/engine';
import type { AssessmentInputs, Profile } from '@sthreecare/shared';

const mockProfile: Profile = {
  id: 'profile_test_1',
  ageBand: '20-29',
  lifeStage: 'adult',
  isPregnant: false,
  isPostpartum: false,
  history: {
    cyclesOver100PbacCount: 3,
  },
  consent: {
    dataStaysOnDevice: true,
    termsAccepted: true,
    consentTimestamp: '2026-10-24T12:00:00Z',
  },
  createdAt: '2026-10-24T12:00:00Z',
  updatedAt: '2026-10-24T12:00:00Z',
};

describe('Compass Engine End-to-End Deterministic Rules', () => {
  it('returns predictable, identical results for identical inputs', () => {
    const input: AssessmentInputs = {
      pbac: {
        pad: { light: 1, moderate: 2, saturated: 3 },
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 1, large: 0 },
        flooding: 1,
      },
      hb: { hbValue: 12.5 },
    };

    const fixedTime = '2026-10-24T18:00:00.000Z';
    const result1 = run(input, mockProfile, { now: fixedTime });
    const result2 = run(input, mockProfile, { now: fixedTime });

    expect(result1.scores).toEqual(result2.scores);
    expect(result1.flags.map((f) => f.ruleId)).toEqual(result2.flags.map((f) => f.ruleId));
    expect(result1.rulesVersion).toBe('1.0.0');
    expect(result1.date).toBe(fixedTime);
  });

  it('correctly connects PBAC > 100 with moderate anaemia (Hb 9.8 g/dL) per specification', () => {
    // Project plan worked example:
    // "Your PBAC score has been above 100 for 3 cycles, and your Hb is 9.8 g/dl (moderate anaemia for non-pregnant women)."
    const input: AssessmentInputs = {
      pbac: {
        pad: { light: 0, moderate: 0, saturated: 5 }, // 5 * 20 = 100
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 0, large: 0 },
        flooding: 0,
      },
      hb: { hbValue: 9.8 },
    };

    const result = run(input, mockProfile);

    // Should have pbac flag, hb flag, and connected flag
    const connectedFlag = result.flags.find((f) => f.ruleId === 'connector_heavy_bleeding_anaemia');
    expect(connectedFlag).toBeDefined();
    expect(connectedFlag?.level).toBe('discuss');
    expect(connectedFlag?.why).toContain('suggest');
    expect(connectedFlag?.why).toContain('9.8');
    expect(connectedFlag?.nextStep).toContain('ferritin');

    // Never claims medical certainty or diagnoses disease
    result.flags.forEach((flag) => {
      expect(flag.why.toLowerCase()).not.toContain('you have a disease');
      expect(flag.why.toLowerCase()).not.toContain('we diagnose');
    });
  });

  it('prioritises urgent warning signs above ordinary screening flags', () => {
    const input: AssessmentInputs = {
      dangerSigns: {
        selectedSigns: ['danger_soaking_rate'],
      },
      pbac: {
        pad: { light: 10, moderate: 0, saturated: 0 },
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 0, large: 0 },
        flooding: 0,
      },
      hb: { hbValue: 12.8 },
    };

    const result = run(input, mockProfile);

    expect(result.flags.length).toBeGreaterThan(0);
    // Urgent danger sign must be at the very top (index 0)
    expect(result.flags[0].level).toBe('urgent');
    expect(result.flags[0].ruleId).toBe('danger_soaking_rate');
  });

  it('handles empty / invalid / unprovided inputs safely without throwing', () => {
    expect(() => run({})).not.toThrow();
    const emptyResult = run({});
    expect(emptyResult.flags).toBeDefined();
    expect(emptyResult.scores).toEqual({});
  });
});
