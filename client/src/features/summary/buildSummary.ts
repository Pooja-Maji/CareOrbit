import type { Profile, Result } from '@sthreecare/shared';
import { formatDate } from '../../lib/format';

export interface FormattedSummary {
  date: string;
  lifeStage: string;
  ageBand: string;
  scores: { label: string; value: string; threshold: string }[];
  flags: { title: string; why: string; nextStep: string; source: string }[];
  doctorTalkingPoints: string[];
}

export function buildClinicianSummary(result: Result, profile: Profile): FormattedSummary {
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
    date: formatDate(result.date),
    lifeStage: profile.lifeStage,
    ageBand: profile.ageBand,
    scores,
    flags,
    doctorTalkingPoints,
  };
}
