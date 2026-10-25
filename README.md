# Care Orbit

**Life-Stage Health Compass for women.** Care Orbit helps women check in on their health at every life stage — teen, adult, pregnancy, postpartum and 40+ — using validated screening instruments and published clinical guidelines, then guides them to the right care.

> Care Orbit is a screening and care-navigation tool, **not** a diagnostic medical device. It does not replace a doctor's examination. Always discuss results with a qualified clinician.

## Features

- **Health checks** – menstrual blood loss (PBAC), haemoglobin (WHO thresholds), postnatal mood (EPDS), symptom log, body-pain painter and danger-sign screening.
- **Deterministic, explainable results** – clinical rules are plain JSON in `common/rules/`, reviewable by clinicians.
- **Doctor summary** – printable / PDF report with a QR code.
- **Care thread & history** – timeline of past checks, compare view and follow-up reminders.
- **Find care** – facility directory and map.
- **Volunteer support & Time Bank** – request a companion, earn and spend care credits.
- **Emergency & crisis support** – always reachable, even when logged out.
- **Privacy first** – health data stays on the device (IndexedDB); the API never receives it.
- **Branding** – Care Orbit splash (5 s) on every launch, logo in the header and browser tab, light/dark theme.

## Project structure

```
care-orbit/
├── apps/
│   ├── web/                      React + Vite + Tailwind web app (@care-orbit/web)
│   │   ├── public/               static files (brand logos, icons, illustrations)
│   │   ├── src/
│   │   │   ├── app/              shell, header, footer, routes, error boundary
│   │   │   ├── features/         one folder per feature (assess, result, history, ...)
│   │   │   ├── design/           design tokens and UI primitives
│   │   │   ├── db/               on-device database, repos, export/import
│   │   │   ├── api/              API clients
│   │   │   ├── lib/  state/      helpers, stores
│   │   │   └── copy.ts           clinician-reviewable text
│   │   └── e2e/                  Playwright end-to-end tests
│   └── api/                      FastAPI backend (care-orbit-api)
│       ├── app/                  routers, services, models, middleware
│       ├── seed/                 demo facilities and volunteers
│       ├── reference/            Python reference scorers (tests only)
│       ├── scripts/              seed, OpenAPI export, privacy-boundary check
│       └── tests/
├── packages/
│   ├── compass/                  screening engine and scorers (@care-orbit/compass)
│   └── shared/                   shared types, units, constants (@care-orbit/shared)
├── common/
│   ├── rules/                    clinical rules (JSON), schemas, SOURCES.md
│   └── verification/             test cases shared by TypeScript and Python
├── docs/                         architecture notes
├── scripts/                      rule validation, API-type generation
├── .github/workflows/            CI
├── Makefile
├── pnpm-workspace.yaml
└── package.json
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the pieces fit together.

## Requirements

| Tool    | Version |
|---------|---------|
| Node.js | 18+ (20 recommended) |
| pnpm    | 8+ |
| Python  | 3.11+ (only for the API) |

## Quick start (web app)

```bash
pnpm install
pnpm dev            # or: make dev
```

Open http://localhost:5173. You will see the Care Orbit splash for 5 seconds, then the login page (or the home page if you are already signed in).

## Scripts

Run from the repository root:

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Start the web app |
| `pnpm build` | Production build of the web app |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | Type-check every package |
| `pnpm test` | Run the screening-engine tests (Vitest) |
| `pnpm validate:rules` | Validate `common/rules/*.json` |
| `make test-api` | Run the API tests (pytest) |
| `make check-boundary` | Verify the API never imports health logic |
| `make gen-api` | Export OpenAPI and regenerate shared API types |

## API (optional)

The web app works on-device. The API powers facilities, volunteer matching and Time Bank credits.

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cd ../..
make seed
make dev-api        # http://localhost:8000  (docs at /docs)
```

Point the web app at it by copying `apps/web/.env.example` to `apps/web/.env`:

```
VITE_API_URL=http://localhost:8000
```

## Using the app

1. **Register** with name, 10-digit mobile number and password (demo auth, stored on the device), or **Sign in**.
2. Accept the consent screen, then start a **Health Check**.
3. Read the result, why each flag was raised, self-care tips and a doctor script.
4. Export a **doctor summary** (print / PDF) or **back up** your data as `CareOrbit_Health_Backup_<date>.json`.

## Branding assets

| File (in `apps/web/public/`) | Used for |
|------|----------|
| `brand/care-orbit-logo.png` | Splash screen (logo with name) |
| `brand/care-orbit-mark.png` | Header and login page (logo without name) |
| `favicon-32.png`, `icon-192.png`, `icon-512.png`, `favicon.ico`, `apple-touch-icon.png` | Browser tab / home-screen icons (transparent) |

Splash length: `SPLASH_DURATION_MS` in `apps/web/src/features/onboarding/SplashScreen.tsx`.

## Privacy & safety

- Health data lives only in the browser (IndexedDB) and is never sent to the API. Middleware rejects health fields, and `make check-boundary` runs in CI and the pre-commit hook.
- Auto-lock after inactivity, one-click data clearing, and export/import are built in.
- The emergency number in the header is **108** (India).

## Sources & license

Clinical sources: `common/rules/SOURCES.md`. License: see `LICENSE`.
