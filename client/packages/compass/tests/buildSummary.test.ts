/**
 * SthreeCare - Clinician Summary Builder Unit Tests
 * Owner: Person A
 */

import { describe, it, expect } from 'vitest';
import type { Result, Profile } from '@sthreecare/shared';

// Clinical summary builder logic
function buildClinicianSummary(result: Result, profile: Profile) {
  const scores: { label: string; value: string; threshold: string }[] = [];

  if (typeof result.scores['pbac'] === 'number') {
    scores.push({
      label: 'Menstrual Flow (PBAC)',
      value: `${result.scores['pbac']} pts`,
      threshold: '≥ 100 points (~80 mL)',
    });
  }

  if (typeof result.scores['hb'] === 'number') {
    scores.push({
      label: 'Haemoglobin (Hb)',
      value: `${result.scores['hb']} g/dL`,
      threshold: profile.isPregnant ? '≥ 11.0 g/dL' : '≥ 12.0 g/dL',
    });
  }

  if (typeof result.scores['epds'] === 'number') {
    scores.push({
      label: 'Edinburgh Mood Scale (EPDS)',
      value: `${result.scores['epds']} / 30`,
      threshold: '≥ 13 points',
    });
  }

  const flags = result.flags.map((f) => ({
    title: f.title,
    why: f.why,
    nextStep: f.nextStep,
    source: f.source,
  }));

  const doctorTalkingPoints = flags.map((f) => f.nextStep);

  return {
    date: result.date,
    lifeStage: profile.lifeStage,
    ageBand: profile.ageBand,
    scores,
    flags,
    doctorTalkingPoints,
  };
}

describe('buildClinicianSummary', () => {
  const mockProfile: Profile = {
    id: 'user_test',
    ageBand: '20-29',
    lifeStage: 'adult',
    isPregnant: false,
    isPostpartum: false,
    history: {},
    consent: {
      dataStaysOnDevice: true,
      termsAccepted: true,
      consentTimestamp: '2026-10-25T10:00:00Z',
    },
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z',
  };

  const mockResult: Result = {
    id: 'res_123',
    profileId: 'user_test',
    date: '2026-10-25T10:30:00Z',
    stage: 'adult',
    inputs: {},
    scores: {
      pbac: 134,
      hb: 9.8,
      epds: 14,
    },
    flags: [
      {
        id: 'flag_pbac',
        ruleId: 'pbac_menorrhagia',
        level: 'discuss',
        title: 'Elevated Menstrual Blood Loss',
        why: 'PBAC score is 134 points, exceeding the published threshold of 100 points.',
        source: 'Higham et al., BJOG 1990',
        nextStep: 'Discuss heavy menstrual bleeding evaluation and ferritin test with doctor.',
      },
      {
        id: 'flag_hb',
        ruleId: 'hb_moderate_anaemia',
        level: 'discuss',
        title: 'Haemoglobin Below Reference Range (Moderate Anaemia)',
        why: 'Recorded Hb is 9.8 g/dL, which falls within the WHO moderate anaemia bracket.',
        source: 'WHO Haemoglobin Concentrations 2011',
        nextStep: 'Ask doctor about iron profile and dietary therapy.',
      },
    ],
    rulesVersion: '1.0.0',
  };

  it('formats clinical summary with correct patient metadata', () => {
    const summary = buildClinicianSummary(mockResult, mockProfile);

    expect(summary.lifeStage).toBe('adult');
    expect(summary.ageBand).toBe('20-29');
    expect(summary.scores).toHaveLength(3);
    expect(summary.flags).toHaveLength(2);
  });

  it('extracts PBAC, Hb, and EPDS scores with appropriate thresholds', () => {
    const summary = buildClinicianSummary(mockResult, mockProfile);

    const pbacScore = summary.scores.find((s) => s.label.includes('PBAC'));
    expect(pbacScore).toBeDefined();
    expect(pbacScore?.value).toBe('134 pts');
    expect(pbacScore?.threshold).toContain('100');

    const hbScore = summary.scores.find((s) => s.label.includes('Hb'));
    expect(hbScore).toBeDefined();
    expect(hbScore?.value).toBe('9.8 g/dL');
    expect(hbScore?.threshold).toContain('12.0');

    const epdsScore = summary.scores.find((s) => s.label.includes('EPDS'));
    expect(epdsScore).toBeDefined();
    expect(epdsScore?.value).toBe('14 / 30');
    expect(epdsScore?.threshold).toContain('13');
  });

  it('adjusts Hb reference threshold for pregnant individuals', () => {
    const pregnantProfile: Profile = {
      ...mockProfile,
      lifeStage: 'pregnant',
      isPregnant: true,
    };

    const summary = buildClinicianSummary(mockResult, pregnantProfile);
    const hbScore = summary.scores.find((s) => s.label.includes('Hb'));
    expect(hbScore?.threshold).toContain('11.0');
  });

  it('derives doctor talking points directly from flag nextSteps', () => {
    const summary = buildClinicianSummary(mockResult, mockProfile);

    expect(summary.doctorTalkingPoints).toEqual([
      'Discuss heavy menstrual bleeding evaluation and ferritin test with doctor.',
      'Ask doctor about iron profile and dietary therapy.',
    ]);
  });
});
