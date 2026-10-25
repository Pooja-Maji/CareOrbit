/**
 * Care Orbit - Assessment Workflow Hook (Stage 5 & 6)
 * Owner: Person A
 * 
 * Encapsulates assessment state, instrument switching, life-stage adaptivity,
 * real-time danger signs detection, demo scenario prefilling, and compass execution.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { run } from '@sthreecare/compass';
import type { Result, LifeStage, AssessmentInputs } from '@sthreecare/shared';
import { saveResultToDb } from '../../db/historyRepo';
import { addFollowUpFromFlag } from '../../db/followUpRepo';

export type AssessmentTab = 'pbac' | 'hb' | 'epds' | 'symptoms' | 'pain';

export interface AssessmentInstrumentInfo {
  id: AssessmentTab;
  label: string;
  shortName: string;
  recommendedFor: LifeStage[];
  description: string;
  source: string;
}

export const ASSESSMENT_INSTRUMENTS: AssessmentInstrumentInfo[] = [
  {
    id: 'pbac',
    label: 'Menstrual Flow (PBAC)',
    shortName: 'PBAC Chart',
    recommendedFor: ['teen', 'adult', '40plus'],
    description: 'Visual pad and tampon saturation scoring (Higham 1990)',
    source: 'Higham et al., BJOG 1990',
  },
  {
    id: 'hb',
    label: 'Haemoglobin (Hb)',
    shortName: 'Blood Report',
    recommendedFor: ['teen', 'adult', 'pregnant', 'postpartum', '40plus'],
    description: 'WHO anaemia classification cut-offs for pregnant and non-pregnant women',
    source: 'WHO Haemoglobin Concentrations 2011',
  },
  {
    id: 'epds',
    label: 'Mood & Well-being (EPDS)',
    shortName: 'Mood Check',
    recommendedFor: ['pregnant', 'postpartum', 'adult'],
    description: 'Edinburgh Postnatal Depression Scale 10-item screen (Cox 1987)',
    source: 'Cox et al., Br J Psychiatry 1987',
  },
  {
    id: 'symptoms',
    label: 'Symptoms & Warning Signs',
    shortName: 'Symptom Log',
    recommendedFor: ['teen', 'adult', 'pregnant', 'postpartum', '40plus'],
    description: 'Cycle regularity, pain severity, and immediate red-flag signs',
    source: 'MoHFW / WHO Danger Signs Guidelines',
  },
  {
    id: 'pain',
    label: 'Body Pain Map (Painter)',
    shortName: 'Pain Painter',
    recommendedFor: ['teen', 'adult', '40plus'],
    description: 'Anatomical pelvic, ovarian, and sacral pain location mapping',
    source: 'Endometriosis & Chronic Pelvic Pain Clinical Criteria',
  },
];

export function useAssessment() {
  const navigate = useNavigate();
  const { profile, inputs, updateInputs, setResult, saveResultToHistory } = useAppStore();

  // Determine initial tab based on woman's life stage
  const defaultTab: AssessmentTab = useMemo(() => {
    if (profile.lifeStage === 'postpartum') return 'epds';
    if (profile.lifeStage === 'pregnant') return 'hb';
    return 'pbac';
  }, [profile.lifeStage]);

  const [activeTab, setActiveTab] = useState<AssessmentTab>(defaultTab);

  // Check if any urgent danger sign is currently selected
  const hasUrgentDangerSigns = useMemo(() => {
    const signs = inputs.dangerSigns?.selectedSigns || [];
    return signs.length > 0;
  }, [inputs.dangerSigns]);

  // Check if EPDS self-harm item is positive
  const hasSelfHarmRisk = useMemo(() => {
    const epdsAnswers = inputs.epds?.answers || [];
    const item10 = epdsAnswers[9] || 0;
    return item10 > 0;
  }, [inputs.epds]);

  // Execute the deterministic Compass Engine
  const evaluateAssessment = (): Result => {
    const evaluation = run(inputs, profile);

    // Save to in-memory store
    setResult(evaluation);

    // Save to local storage history
    saveResultToHistory(evaluation);

    // Persist to IndexedDB
    saveResultToDb(evaluation).catch((err) =>
      console.warn('Dexie save error:', err)
    );

    // Auto-create follow-up recommendations in Dexie database for Person B
    evaluation.flags.forEach((f) => {
      if (f.nextStep) {
        addFollowUpFromFlag(evaluation.id, f.nextStep).catch(() => {});
      }
    });

    // Determine navigation path
    const hasUrgentDanger = evaluation.flags.some(
      (f) => f.level === 'urgent' && (f.ruleId.startsWith('danger_') || f.ruleId === 'epds_self_harm_risk')
    );

    if (hasUrgentDanger) {
      navigate('/emergency');
    } else {
      navigate('/result');
    }

    return evaluation;
  };

  // Demo Preset 1: 90-Second Hackathon Demo Path (Page 16 of Project Plan)
  // PBAC score = 134 pts (above 100), Hb = 9.8 g/dL (moderate anaemia)
  // Demonstrates cross-instrument connector flag & gauge threshold line
  const load90SecondDemo = () => {
    updateInputs({
      pbac: {
        pad: { light: 2, moderate: 4, saturated: 5 }, // 2*1 + 4*5 + 5*20 = 122 pts
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 2, large: 1 }, // 2*1 + 5 = 7 pts
        flooding: 1, // 5 pts -> total = 134 pts
      },
      hb: { hbValue: 9.8, testDate: new Date().toISOString().split('T')[0] },
      dangerSigns: { selectedSigns: [] },
      symptoms: {
        cycleLengthDays: 28,
        periodDurationDays: 7,
        painLevel: 6,
        disruptivePainCycles: 3,
        heavyBleedingCycles: 3,
        painLocations: ['pelvic_suprapubic', 'lower_back_sacral'],
      },
    });
    setActiveTab('pbac');
  };

  // Demo Preset 2: Postpartum Mood Screening (EPDS >= 13)
  const loadPostpartumMoodDemo = () => {
    updateInputs({
      epds: {
        answers: [2, 2, 2, 2, 2, 1, 1, 1, 1, 0], // Total = 14 (above threshold 13, item 10 safe)
      },
      hb: { hbValue: 10.4 },
      dangerSigns: { selectedSigns: [] },
    });
    setActiveTab('epds');
  };

  // Demo Preset 3: Emergency Red-Flag Scenario
  const loadEmergencyDemo = () => {
    updateInputs({
      dangerSigns: {
        selectedSigns: ['danger_soaking_rate', 'danger_fainting_dizziness'],
      },
    });
    setActiveTab('symptoms');
  };

  // Reset all inputs back to baseline
  const resetAllInputs = () => {
    updateInputs({
      pbac: {
        pad: { light: 0, moderate: 0, saturated: 0 },
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 0, large: 0 },
        flooding: 0,
      },
      hb: { hbValue: 12.0 },
      epds: { answers: new Array(10).fill(0) },
      dangerSigns: { selectedSigns: [] },
      symptoms: {
        cycleLengthDays: 28,
        periodDurationDays: 5,
        painLevel: 0,
        disruptivePainCycles: 0,
        heavyBleedingCycles: 0,
        painLocations: [],
      },
    });
  };

  return {
    activeTab,
    setActiveTab,
    hasUrgentDangerSigns,
    hasSelfHarmRisk,
    evaluateAssessment,
    load90SecondDemo,
    loadPostpartumMoodDemo,
    loadEmergencyDemo,
    resetAllInputs,
    inputs,
    profile,
  };
}
