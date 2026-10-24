import { describe, it, expect } from 'vitest';
import pbacCases from '../../../../common/verification/cases/pbac.cases.json';
import hbCases from '../../../../common/verification/cases/hb.cases.json';
import epdsCases from '../../../../common/verification/cases/epds.cases.json';
import dangerCases from '../../../../common/verification/cases/danger_signs.cases.json';

import { scorePbac } from '../src/scorers/pbac';
import { scoreHb, classifyHaemoglobin } from '../src/scorers/hb';
import { scoreEpds } from '../src/scorers/epds';
import { scoreDangerSigns } from '../src/scorers/dangerSigns';

describe('Shared Verification Test Cases (Language-Neutral Oracle)', () => {
  describe('PBAC Verification Cases', () => {
    pbacCases.forEach((testCase, index) => {
      it(`Case ${index + 1}: ${testCase.description}`, () => {
        const result = scorePbac(testCase.input as any);
        expect(result.score).toBe(testCase.expectedScore);
        if (testCase.expectedFlagLevel) {
          expect(result.flags.length).toBeGreaterThan(0);
          expect(result.flags[0].level).toBe(testCase.expectedFlagLevel);
        } else {
          expect(result.flags.length).toBe(0);
        }
      });
    });
  });

  describe('Haemoglobin WHO Cut-off Cases', () => {
    hbCases.forEach((testCase, index) => {
      it(`Case ${index + 1}: ${testCase.description}`, () => {
        const { category } = classifyHaemoglobin(testCase.hbValue, testCase.isPregnant);
        expect(category).toBe(testCase.expectedCategory);

        const result = scoreHb({ hbValue: testCase.hbValue }, testCase.isPregnant);
        if (testCase.expectedFlagLevel) {
          expect(result.flags.length).toBeGreaterThan(0);
          expect(result.flags[0].level).toBe(testCase.expectedFlagLevel);
        } else {
          expect(result.flags.length).toBe(0);
        }
      });
    });
  });

  describe('EPDS Mood & Self-Harm Cases', () => {
    epdsCases.forEach((testCase, index) => {
      it(`Case ${index + 1}: ${testCase.description}`, () => {
        const result = scoreEpds({ answers: testCase.answers });
        expect(result.score).toBe(testCase.expectedScore);

        if (testCase.expectedSelfHarmTrigger) {
          expect(result.isUrgentEmergency).toBe(true);
          const selfHarmFlag = result.flags.find((f) => f.ruleId === 'epds_self_harm_risk');
          expect(selfHarmFlag).toBeDefined();
          expect(selfHarmFlag?.level).toBe('urgent');
        } else {
          expect(result.isUrgentEmergency).toBe(false);
        }

        if (testCase.expectedFlagLevel) {
          expect(result.flags.some((f) => f.level === testCase.expectedFlagLevel)).toBe(true);
        }
      });
    });
  });

  describe('Danger Signs Cases', () => {
    dangerCases.forEach((testCase, index) => {
      it(`Case ${index + 1}: ${testCase.description}`, () => {
        const result = scoreDangerSigns({ selectedSigns: testCase.selectedSigns });
        expect(result.isUrgentEmergency).toBe(testCase.expectedEmergencyTrigger);
        if (testCase.expectedFlagLevel) {
          expect(result.flags.some((f) => f.level === testCase.expectedFlagLevel)).toBe(true);
        } else {
          expect(result.flags.length).toBe(0);
        }
      });
    });
  });
});
