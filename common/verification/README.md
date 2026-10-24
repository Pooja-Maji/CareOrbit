# Verification Test Cases

These JSON fixtures serve as an independent language-neutral test oracle. They are read by:
1. Vitest automated tests in the TypeScript Compass engine (`client/packages/compass/tests/sharedCases.test.ts`).
2. Python test runner (`server/tests/test_reference_cases.py` owned by Person B) to ensure strict parity between frontend engine and backend reference models.
