# SthreeCare Reference Scorers

These Python files serve exclusively as an independent **test oracle** for cross-language validation.
They are never imported by the runtime backend (`server/app/`).
Instead, they are used by unit tests (`server/tests/test_reference_cases.py`) to verify that the TypeScript engine and Python scorers agree 100% on all verification cases in `common/verification/cases/`.
