/**
 * SthreeCare - Common Rules Schema Validator
 * Owner: Person A
 *
 * Validates all deterministic JSON rules in common/rules
 * against the shared specification.
 */

import * as fs from 'fs';
import * as path from 'path';

function validateRules() {
  const rulesDir = path.resolve(__dirname, '..', 'common', 'rules');
  const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.json'));

  console.log(`Checking ${files.length} rule files in common/rules...`);
  let validCount = 0;

  for (const file of files) {
    const fullPath = path.join(rulesDir, file);
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    if (!content.id || !content.version || !content.source) {
      throw new Error(`Rule file ${file} missing required fields (id, version, or source)`);
    }

    console.log(`  ✓ ${file}: id="${content.id}" version="${content.version}"`);
    validCount++;
  }

  console.log(`All ${validCount} rule definitions validated successfully.`);
}

validateRules();
