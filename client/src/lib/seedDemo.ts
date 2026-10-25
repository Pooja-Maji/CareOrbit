/**
 * Care Orbit - Demo Persona Seeder
 * Owner: Person B
 * 
 * Pre-populates realistic longitudinal cycle history matching Section 4:
 * "Your PBAC score has been above 100 for 3 cycles, and your Hb is 9.8 g/dl"
 * Allows judges and testers to immediately view trends, Care Thread timeline,
 * and follow-up closure without having to manually invent 3 months of data.
 */

import type { Result } from '@sthreecare/shared';
import { saveResultToDb } from '../db/historyRepo';
import { saveStoredProfile } from '../db/profileRepo';

export const DEMO_PERSONA_PROFILE = {
  id: 'local_user_profile',
  phoneNumber: '9876543210',
  ageBand: '20-29' as const,
  lifeStage: 'adult' as const,
  isPregnant: false,
  isPostpartum: false,
  history: {
    cyclesOver100PbacCount: 3,
    hadUltrasound: false,
    priorAnaemiaDiagnosis: true,
    familyHistoryEndometriosis: false,
    notes: 'Long-standing heavy periods with fatigue during menses.',
  },
  consent: {
    dataStaysOnDevice: true,
    termsAccepted: true,
    consentTimestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_CYCLES_HISTORY: Result[] = [
  // Cycle 1: Two months ago
  {
    id: 'res_demo_cycle_1',
    profileId: 'local_user_profile',
    date: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    stage: 'adult',
    inputs: {
      pbac: { pad: { light: 2, moderate: 6, saturated: 5 }, tampon: { light: 0, moderate: 0, saturated: 0 }, clot: { small: 3, large: 2 }, flooding: 1 },
      symptoms: { cycleLengthDays: 28, periodDurationDays: 6, painLevel: 6 },
    },
    scores: {
      pbac: 147,
    },
    flags: [
      {
        id: 'flag_pbac_cycle1',
        ruleId: 'pbac_heavy_bleeding',
        level: 'discuss',
        title: 'Elevated Menstrual Flow (PBAC 147)',
        why: 'Score exceeds the validated clinical threshold of 100, indicating menstrual blood loss exceeding 80mL.',
        source: 'Higham et al., BJOG 1990',
        nextStep: 'Track bleeding for subsequent cycle and observe if heavy flow persists.',
      },
    ],
    rulesVersion: '1.0',
  },

  // Cycle 2: One month ago
  {
    id: 'res_demo_cycle_2',
    profileId: 'local_user_profile',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    stage: 'adult',
    inputs: {
      pbac: { pad: { light: 1, moderate: 8, saturated: 6 }, tampon: { light: 0, moderate: 0, saturated: 0 }, clot: { small: 4, large: 3 }, flooding: 2 },
      symptoms: { cycleLengthDays: 27, periodDurationDays: 7, painLevel: 7 },
    },
    scores: {
      pbac: 181,
    },
    flags: [
      {
        id: 'flag_pbac_cycle2',
        ruleId: 'pbac_heavy_bleeding',
        level: 'discuss',
        title: 'Recurrent Heavy Menstrual Bleeding (PBAC 181)',
        why: 'Second consecutive cycle with PBAC above 100.',
        source: 'Higham et al., BJOG 1990',
        nextStep: 'Request complete haemogram (CBC) and serum ferritin test from Primary Health Centre.',
      },
    ],
    rulesVersion: '1.0',
  },

  // Cycle 3: Recent Check (with Lab Hb entered)
  {
    id: 'res_demo_cycle_3',
    profileId: 'local_user_profile',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    stage: 'adult',
    inputs: {
      pbac: { pad: { light: 2, moderate: 7, saturated: 8 }, tampon: { light: 0, moderate: 0, saturated: 0 }, clot: { small: 5, large: 4 }, flooding: 2 },
      hb: { hbValue: 9.8, labName: 'Surathkal PHC Lab' },
      symptoms: { cycleLengthDays: 28, periodDurationDays: 7, painLevel: 8, disruptivePainCycles: 2, heavyBleedingCycles: 3 },
    },
    scores: {
      pbac: 217,
      hb: 9.8,
    },
    flags: [
      {
        id: 'flag_pbac_hb_combined',
        ruleId: 'connected_pbac_anaemia',
        level: 'discuss',
        title: 'Combined Heavy Bleeding & Moderate Anaemia',
        why: 'PBAC score has exceeded 100 for 3 consecutive cycles and laboratory haemoglobin is 9.8 g/dL (moderate anaemia per WHO cut-offs). Together these suggest heavy bleeding may be contributing to chronic iron deficiency.',
        source: 'WHO Haemoglobin Concentrations 2011 & Higham 1990',
        nextStep: 'Discuss with a gynaecologist: ask about a serum ferritin test and pelvic ultrasound to determine underlying cause.',
      },
      {
        id: 'flag_escalation_pain',
        ruleId: 'escalation_dysmenorrhea',
        level: 'discuss',
        title: 'Persistent Disruptive Menstrual Pain',
        why: 'Pain level 8/10 reported across multiple cycles interfering with daily activities.',
        source: 'ESHRE Guidelines on Endometriosis Management',
        nextStep: 'Ask doctor about clinical evaluation for secondary dysmenorrhea or pelvic scan.',
      },
    ],
    rulesVersion: '1.0',
  },
];

export async function seedDemoPersonaIfEmpty(): Promise<boolean> {
  try {
    const existing = localStorage.getItem('sthreecare_history');
    if (!existing || JSON.parse(existing).length === 0) {
      await saveStoredProfile(DEMO_PERSONA_PROFILE);
      for (const res of DEMO_CYCLES_HISTORY) {
        await saveResultToDb(res);
      }
      localStorage.setItem('sthreecare_history', JSON.stringify(DEMO_CYCLES_HISTORY));
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Seed persona error', e);
    return false;
  }
}
