import type { EpdsInputs, Flag } from '@sthreecare/shared';
import type { ScorerOutput } from '../internalTypes';
import { rules } from '../ruleLoader';
import { buildFlag } from '../flagBuilder';

export function scoreEpds(input?: EpdsInputs): ScorerOutput {
  const flags: Flag[] = [];
  if (!input || !Array.isArray(input.answers) || input.answers.length === 0) {
    return { instrumentId: 'epds', flags };
  }

  const epdsRule = rules.epds;
  const totalScore = input.answers.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

  // Item 10 evaluates thoughts of self-harm (index 9 in 0-indexed array)
  const item10Score = input.answers[9] || 0;
  const hasSelfHarmRisk = item10Score > 0;

  if (hasSelfHarmRisk) {
    flags.push(
      buildFlag({
        ruleId: 'epds_self_harm_risk',
        level: 'urgent',
        title: 'Immediate Emotional & Crisis Support Available',
        why: 'You reported having thoughts of harming yourself. Your safety and well-being are paramount, and confidential help is ready right now.',
        source: `${epdsRule.source} (Item 10 Self-Harm Rule)`,
        nextStep: 'Please reach out for support immediately. Speak with Tele-MANAS (14416 - free 24/7), call 108, or tell a loved one or trusted clinician right now.',
      })
    );
  }

  if (totalScore >= epdsRule.threshold) {
    flags.push(
      buildFlag({
        ruleId: 'epds_elevated_depression_risk',
        level: 'discuss',
        title: `Elevated Mood Screening Score (EPDS ${totalScore} / 30)`,
        why: `Your Edinburgh Postnatal Depression Scale score is ${totalScore}, meeting the screening threshold of 13+. This tool screens for symptoms of maternal/postnatal depression and does not diagnose a clinical mood disorder. It is not validated for general anxiety.`,
        source: `${epdsRule.source} (${epdsRule.clinical_review_status})`,
        nextStep: 'Talk openly with your obstetrician, family physician, or a mental health professional about emotional well-being and postpartum support.',
      })
    );
  }

  return {
    instrumentId: 'epds',
    score: totalScore,
    flags,
    isUrgentEmergency: hasSelfHarmRisk,
  };
}
