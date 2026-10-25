/**
 * SthreeCare - Cross-Instrument Connectors Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { evaluateConnectors } from '../src/connectors';
import type { Profile } from '@sthreecare/shared';

describe('Cross-Instrument Connectors', () => {
  const mockProfile: Profile = {
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

  it('triggers connected finding when heavy bleeding PBAC >= 100 is paired with low Hb (anaemia)', () => {
    // 90-second demo path from Page 16 of plan:
    // PBAC = 134, Hb = 9.8 g/dL -> Connected Finding
    const flags = evaluateConnectors(
      {
        pbac: {
          pad: { light: 2, moderate: 4, saturated: 5 },
          tampon: { light: 0, moderate: 0, saturated: 0 },
          clot: { small: 2, large: 1 },
          flooding: 1,
        },
        hb: { hbValue: 9.8 },
      },
      mockProfile,
      134
    );

    expect(flags).toHaveLength(1);
    expect(flags[0].ruleId).toBe('connector_heavy_bleeding_anaemia');
    expect(flags[0].level).toBe('discuss');
    expect(flags[0].why).toContain('contributing to depleted iron reserves');
    expect(flags[0].nextStep).toContain('ferritin');
  });

  it('does not trigger connector if PBAC is elevated but Hb is normal (>= 12.0)', () => {
    const flags = evaluateConnectors(
      {
        pbac: {
          pad: { light: 0, moderate: 0, saturated: 6 }, // 120 pts
          tampon: { light: 0, moderate: 0, saturated: 0 },
          clot: { small: 0, large: 0 },
          flooding: 0,
        },
        hb: { hbValue: 13.2 },
      },
      mockProfile,
      120
    );

    expect(flags).toHaveLength(0);
  });

  it('does not trigger connector if Hb is low but PBAC is normal (< 100)', () => {
    const flags = evaluateConnectors(
      {
        pbac: {
          pad: { light: 2, moderate: 2, saturated: 0 }, // 12 pts
          tampon: { light: 0, moderate: 0, saturated: 0 },
          clot: { small: 0, large: 0 },
          flooding: 0,
        },
        hb: { hbValue: 10.5 },
      },
      mockProfile,
      12
    );

    expect(flags).toHaveLength(0);
  });
});
