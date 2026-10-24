/**
 * SthreeCare - Seed Demo Persona CLI Script
 * Owner: Person B
 */

import { DEMO_PERSONA_PROFILE, DEMO_CYCLES_HISTORY } from '../client/src/lib/seedDemo';

console.log('SthreeCare Demo Persona Fixture:');
console.log('Profile:', DEMO_PERSONA_PROFILE.ageBand, DEMO_PERSONA_PROFILE.lifeStage);
console.log(`Cycles Count: ${DEMO_CYCLES_HISTORY.length}`);
DEMO_CYCLES_HISTORY.forEach((c, idx) => {
  console.log(`  Cycle ${idx + 1} (${c.date}): PBAC=${c.scores.pbac}, Hb=${c.scores.hb ?? 'N/A'}`);
});
