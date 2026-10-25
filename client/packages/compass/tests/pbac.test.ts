/**
 * SthreeCare - PBAC Scorer Unit Tests (Higham 1990 validation)
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scorePbac, calculatePbacScore } from '../src/scorers/pbac';

describe('PBAC Scorer', () => {
  it('calculates score of 0 for empty inputs', () => {
    const score = calculatePbacScore({
      pad: { light: 0, moderate: 0, saturated: 0 },
      tampon: { light: 0, moderate: 0, saturated: 0 },
      clot: { small: 0, large: 0 },
      flooding: 0,
    });
    expect(score).toBe(0);
  });

  it('correctly calculates points per Higham pictorial chart', () => {
    // 1 light pad (1 pt), 2 moderate pads (10 pts), 1 saturated pad (20 pts)
    // 1 light tampon (1 pt), 1 moderate tampon (5 pts), 1 saturated tampon (10 pts)
    // 1 small clot (1 pt), 1 large clot (5 pts), 1 flooding episode (5 pts)
    // Total = 1 + 10 + 20 + 1 + 5 + 10 + 1 + 5 + 5 = 58
    const score = calculatePbacScore({
      pad: { light: 1, moderate: 2, saturated: 1 },
      tampon: { light: 1, moderate: 1, saturated: 1 },
      clot: { small: 1, large: 1 },
      flooding: 1,
    });
    expect(score).toBe(58);
  });

  it('flags heavy bleeding when score reaches or exceeds threshold of 100 points', () => {
    // 5 saturated pads = 5 * 20 = 100 points
    const output = scorePbac({
      pad: { light: 0, moderate: 0, saturated: 5 },
      tampon: { light: 0, moderate: 0, saturated: 0 },
      clot: { small: 0, large: 0 },
      flooding: 0,
    });

    expect(output.score).toBe(100);
    expect(output.flags).toHaveLength(1);
    expect(output.flags[0].ruleId).toBe('pbac_menorrhagia');
    expect(output.flags[0].level).toBe('discuss');
    expect(output.flags[0].source).toContain('Higham');
  });

  it('produces no flags when score is strictly below 100', () => {
    const output = scorePbac({
      pad: { light: 3, moderate: 4, saturated: 2 }, // 3*1 + 4*5 + 2*20 = 63
      tampon: { light: 0, moderate: 0, saturated: 0 },
      clot: { small: 2, large: 0 }, // 2*1 = 2 -> total 65
      flooding: 0,
    });

    expect(output.score).toBe(65);
    expect(output.flags).toHaveLength(0);
  });
});
