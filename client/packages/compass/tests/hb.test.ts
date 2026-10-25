/**
 * SthreeCare - WHO Haemoglobin Scorer Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import { scoreHb, classifyHaemoglobin } from '../src/scorers/hb';

describe('WHO Haemoglobin Scorer', () => {
  describe('Non-pregnant cut-offs (normal >= 12.0 g/dL)', () => {
    it('classifies >= 12.0 as normal', () => {
      const { category } = classifyHaemoglobin(12.5, false);
      expect(category).toBe('normal');

      const output = scoreHb({ hbValue: 12.5 }, false);
      expect(output.flags).toHaveLength(0);
    });

    it('classifies 11.0 - 11.9 as mild anaemia', () => {
      const { category } = classifyHaemoglobin(11.4, false);
      expect(category).toBe('mild');

      const output = scoreHb({ hbValue: 11.4 }, false);
      expect(output.flags).toHaveLength(1);
      expect(output.flags[0].ruleId).toBe('hb_mild_anaemia');
      expect(output.flags[0].level).toBe('discuss');
    });

    it('classifies 8.0 - 10.9 as moderate anaemia', () => {
      const { category } = classifyHaemoglobin(9.8, false);
      expect(category).toBe('moderate');

      const output = scoreHb({ hbValue: 9.8 }, false);
      expect(output.flags).toHaveLength(1);
      expect(output.flags[0].ruleId).toBe('hb_moderate_anaemia');
      expect(output.flags[0].level).toBe('discuss');
    });

    it('classifies < 8.0 as severe anaemia with urgent level', () => {
      const { category } = classifyHaemoglobin(7.2, false);
      expect(category).toBe('severe');

      const output = scoreHb({ hbValue: 7.2 }, false);
      expect(output.flags).toHaveLength(1);
      expect(output.flags[0].ruleId).toBe('hb_severe_anaemia');
      expect(output.flags[0].level).toBe('urgent');
    });
  });

  describe('Pregnant cut-offs (normal >= 11.0 g/dL)', () => {
    it('classifies 11.2 as normal during pregnancy', () => {
      const { category } = classifyHaemoglobin(11.2, true);
      expect(category).toBe('normal');

      const output = scoreHb({ hbValue: 11.2 }, true);
      expect(output.flags).toHaveLength(0);
    });

    it('classifies 10.5 as mild anaemia during pregnancy', () => {
      const { category } = classifyHaemoglobin(10.5, true);
      expect(category).toBe('mild');

      const output = scoreHb({ hbValue: 10.5 }, true);
      expect(output.flags).toHaveLength(1);
      expect(output.flags[0].ruleId).toBe('hb_mild_anaemia');
    });

    it('classifies 8.5 as moderate anaemia during pregnancy', () => {
      const { category } = classifyHaemoglobin(8.5, true);
      expect(category).toBe('moderate');
    });

    it('classifies < 7.0 as severe anaemia during pregnancy with urgent level', () => {
      const { category } = classifyHaemoglobin(6.8, true);
      expect(category).toBe('severe');

      const output = scoreHb({ hbValue: 6.8 }, true);
      expect(output.flags).toHaveLength(1);
      expect(output.flags[0].ruleId).toBe('hb_severe_anaemia');
      expect(output.flags[0].level).toBe('urgent');
    });
  });
});
