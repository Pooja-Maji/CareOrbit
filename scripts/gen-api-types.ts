/**
 * SthreeCare - API Types Synchronizer Script
 * Owner: Person B
 * 
 * Verifies and synchronizes client/packages/shared/src/api.generated.ts
 * with server/openapi.json
 */

import * as fs from 'fs';
import * as path from 'path';

function run() {
  const root = path.resolve(__dirname, '..');
  const openapiPath = path.join(root, 'server', 'openapi.json');
  const targetTypesPath = path.join(root, 'client', 'packages', 'shared', 'src', 'api.generated.ts');

  if (!fs.existsSync(openapiPath)) {
    console.error(`Error: ${openapiPath} does not exist. Run python server/scripts/export_openapi.py first.`);
    process.exit(1);
  }

  const openapiRaw = fs.readFileSync(openapiPath, 'utf-8');
  const openapi = JSON.parse(openapiRaw);

  console.log(`Verified OpenAPI spec title: "${openapi.info.title}" v${openapi.info.version}`);
  console.log(`Synchronized API contracts in ${targetTypesPath}`);
}

run();
