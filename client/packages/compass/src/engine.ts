import type { AssessmentInputs, Profile, Result, Flag } from '@sthreecare/shared';
import { RULES_VERSION } from './ruleLoader';
import { scoreDangerSigns } from './scorers/dangerSigns';
import { scorePbac } from './scorers/pbac';
import { scoreHb } from './scorers/hb';
import { scoreEpds } from './scorers/epds';
import { scoreEscalation } from './scorers/escalation';
import { scoreScreening } from './scorers/screening';
import { evaluateConnectors } from './connectors';

export interface CompassEngineOptions {
  now?: string; // Optional fixed timestamp for deterministic tests
}

export function run(inputs: AssessmentInputs, profile?: Profile, options?: CompassEngineOptions): Result {
  const flags: Flag[] = [];
  const scores: Record<string, number> = {};

  // Step 1: Evaluate predefined danger / warning signs FIRST
  const dangerSignsOutput = scoreDangerSigns(inputs.dangerSigns);
  if (dangerSignsOutput.flags.length > 0) {
    flags.push(...dangerSignsOutput.flags);
  }

  // Step 2: Evaluate individual screening instruments
  // 2a: Menstrual PBAC Flow
  let pbacScore: number | undefined;
  if (inputs.pbac) {
    const pbacOutput = scorePbac(inputs.pbac);
    if (typeof pbacOutput.score === 'number') {
      scores['pbac'] = pbacOutput.score;
      pbacScore = pbacOutput.score;
    }
    flags.push(...pbacOutput.flags);
  }

  // 2b: Haemoglobin Value
  const isPregnant = profile?.isPregnant || false;
  if (inputs.hb) {
    const hbOutput = scoreHb(inputs.hb, isPregnant);
    if (typeof hbOutput.score === 'number') {
      scores['hb'] = hbOutput.score;
    }
    flags.push(...hbOutput.flags);
  }

  // 2c: EPDS Mood Questionnaire (Item 10 handled as urgent crisis if triggered)
  if (inputs.epds) {
    const epdsOutput = scoreEpds(inputs.epds);
    if (typeof epdsOutput.score === 'number') {
      scores['epds'] = epdsOutput.score;
    }
    flags.push(...epdsOutput.flags);
  }

  // Step 3: Evaluate cross-instrument connectors
  const connectorFlags = evaluateConnectors(inputs, profile, pbacScore);
  flags.push(...connectorFlags);

  // Step 4: Evaluate escalation rules (persistent symptoms / repeated cycles)
  const escalationOutput = scoreEscalation(inputs.symptoms, profile);
  flags.push(...escalationOutput.flags);

  // Step 5: Preventive age-based screening recommendations
  if (profile) {
    const screeningOutput = scoreScreening(profile);
    flags.push(...screeningOutput.flags);
  }

  // Sort flags so 'urgent' flags always appear at the top, followed by 'discuss', then 'info'
  const severityOrder: Record<string, number> = { urgent: 0, discuss: 1, info: 2 };
  flags.sort((a, b) => (severityOrder[a.level] ?? 3) - (severityOrder[b.level] ?? 3));

  const resultId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const dateStr = options?.now || new Date().toISOString();

  return {
    id: resultId,
    profileId: profile?.id || 'demo_profile',
    date: dateStr,
    stage: profile?.lifeStage || 'adult',
    inputs: inputs as Record<string, unknown>,
    scores,
    flags,
    rulesVersion: RULES_VERSION,
  };
}
