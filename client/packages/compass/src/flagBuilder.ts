import type { Flag, FlagLevel } from '@sthreecare/shared';

export interface CreateFlagParams {
  id?: string;
  ruleId: string;
  level: FlagLevel;
  title: string;
  why: string;
  source: string;
  nextStep: string;
}

let flagCounter = 1;

export function buildFlag(params: CreateFlagParams): Flag {
  return {
    id: params.id || `flag_${params.ruleId}_${flagCounter++}`,
    ruleId: params.ruleId,
    level: params.level,
    title: params.title,
    why: params.why,
    source: params.source,
    nextStep: params.nextStep,
  };
}
