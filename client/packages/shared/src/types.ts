/**
 * SthreeCare - Shared Contract Types
 * Defined per Project Plan Section 7: Data Model and APIs
 */

export type FlagLevel = 'info' | 'discuss' | 'urgent';

export interface Flag {
  id: string;
  ruleId: string;
  level: FlagLevel;
  title: string;
  why: string;
  source: string;
  nextStep: string;
}

export interface Result {
  id: string;
  profileId: string;
  date: string;
  stage: string;
  inputs: Record<string, unknown>;
  scores: Record<string, number>;
  flags: Flag[];
  rulesVersion: string;
}

export type FollowUpStatus = 'open' | 'booked' | 'done' | 'later';

export interface FollowUp {
  id: string;
  resultId: string;
  step: string;
  status: FollowUpStatus;
  dueDate?: string;
}

export type LifeStage = 'teen' | 'adult' | 'pregnant' | 'postpartum' | '40plus';
export type AgeBand = '13-19' | '20-29' | '30-39' | '40-49' | '50plus';

export interface ConsentChoices {
  dataStaysOnDevice: boolean;
  termsAccepted: boolean;
  consentTimestamp: string;
}

export interface ProfileHistory {
  cyclesOver100PbacCount?: number;
  hadUltrasound?: boolean;
  priorAnaemiaDiagnosis?: boolean;
  familyHistoryEndometriosis?: boolean;
  notes?: string;
}

export interface Profile {
  id: string;
  phoneNumber?: string;
  ageBand: AgeBand;
  lifeStage: LifeStage;
  isPregnant: boolean;
  isPostpartum: boolean;
  history: ProfileHistory;
  consent: ConsentChoices;
  createdAt: string;
  updatedAt: string;
}

// Assessment Input Sub-types
export interface PbacPadCounts {
  light: number;
  moderate: number;
  saturated: number;
}

export interface PbacTamponCounts {
  light: number;
  moderate: number;
  saturated: number;
}

export interface PbacClotCounts {
  small: number;
  large: number;
}

export interface PbacInputs {
  pad: PbacPadCounts;
  tampon: PbacTamponCounts;
  clot: PbacClotCounts;
  flooding: number;
  periodDurationDays?: number;
}

export interface HbInputs {
  hbValue: number; // in g/dL, e.g. 9.8
  testDate?: string;
  labName?: string;
}

export interface EpdsInputs {
  answers: number[]; // 10 items, 0-3 each
}

export interface DangerSignsInputs {
  selectedSigns: string[];
}

export interface CycleSymptomInputs {
  cycleLengthDays?: number;
  periodDurationDays?: number;
  painLevel?: number; // 0-10
  disruptivePainCycles?: number;
  heavyBleedingCycles?: number;
}

export interface AssessmentInputs {
  pbac?: PbacInputs;
  hb?: HbInputs;
  epds?: EpdsInputs;
  dangerSigns?: DangerSignsInputs;
  symptoms?: CycleSymptomInputs;
  [key: string]: unknown;
}
