/**
 * SthreeCare - Age-Based Cancer Screening Scorer Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scoreScreening } from '../src/scorers/screening';
import type { Profile } from '@sthreecare/shared';

describe('Screening Scorer', () => {
  const youngProfile: Profile = {
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

  it('does not trigger 30+ screening reminders for age band 20-29', () => {
    const output = scoreScreening(youngProfile);
    expect(output.flags).toHaveLength(0);
  });

  it('triggers screening guidelines for age band 30-39', () => {
    const profile30: Profile = {
      ...youngProfile,
      ageBand: '30-39',
    };
    const output = scoreScreening(profile30);
    expect(output.flags.length).toBeGreaterThan(0);
    expect(output.flags.some((f) => f.ruleId.includes('screening'))).toBe(true);
  });

  it('triggers screening guidelines for lifeStage 40plus', () => {
    const profile40: Profile = {
      ...youngProfile,
      ageBand: '40-49',
      lifeStage: '40plus',
    };
    const output = scoreScreening(profile40);
    expect(output.flags.length).toBeGreaterThan(0);
  });
});
