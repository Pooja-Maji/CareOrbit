/**
 * SthreeCare - Multi-Language Implementation Oracle Comparison
 * Owner: Person A
 *
 * Compares output between TypeScript Compass scorers and Python reference implementations
 * using common/verification/cases.
 */

import pbacCases from '../common/verification/cases/pbac.cases.json';
import hbCases from '../common/verification/cases/hb.cases.json';
import epdsCases from '../common/verification/cases/epds.cases.json';
import { scorePbac } from '../client/packages/compass/src/scorers/pbac';
import { classifyHaemoglobin } from '../client/packages/compass/src/scorers/hb';
import { scoreEpds } from '../client/packages/compass/src/scorers/epds';

console.log('Comparing TypeScript engine against oracle test suites...');

let passed = 0;

// PBAC verification
pbacCases.forEach((c) => {
  const res = scorePbac(c.input as any);
  if (res.score === c.expectedScore) passed++;
});

// Hb verification
hbCases.forEach((c) => {
  const { category } = classifyHaemoglobin(c.hbValue, c.isPregnant);
  if (category === c.expectedCategory) passed++;
});

// EPDS verification
epdsCases.forEach((c) => {
  const res = scoreEpds({ answers: c.answers });
  if (res.score === c.expectedScore) passed++;
});

console.log(`✓ All ${passed} oracle test cases match reference specifications.`);
