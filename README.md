# SthreeCare

SthreeCare is a life-stage health screening and care-navigation prototype for women. It brings together explainable screening tools, guidance on next steps, care-facility information, and community support.

> **Health disclaimer:** SthreeCare is a screening and care-navigation tool, not a diagnostic medical device or a substitute for care from a qualified clinician. Discuss health concerns and screening results with a healthcare professional.

## Project overview

- **Web client:** React and TypeScript application built with Vite.
- **Screening engine:** deterministic screening logic and clinical rules, with shared verification cases.
- **API:** optional FastAPI service for facility information, volunteer support and Time Bank credits. The backend includes middleware that rejects health-related fields.
- **Main user features:** health assessments and results, history and follow-up, finding care, support requests, and a Time Bank.

Screening rules live in `common/rules/` and shared verification cases live in `common/verification/`.

## Project structure

```text
.
├── client/
│   ├── src/                  React application
│   ├── packages/
│   │   ├── compass/          Screening engine and tests
│   │   └── shared/           Shared TypeScript types and constants
│   └── e2e/                  End-to-end test configuration
├── common/
│   ├── rules/                Screening rules and clinical sources
│   └── verification/         Shared screening test cases
├── server/
│   ├── app/                  FastAPI application, routes and services
│   ├── seed/                 Initial facilities and volunteer data
│   └── tests/                Backend tests
├── scripts/                  Repository-level utility scripts
├── public/                   Static assets
├── Makefile                  Common development and test commands
├── package.json              Workspace scripts
└── pnpm-workspace.yaml       pnpm workspace configuration
```

## Requirements and dependencies

Install these tools before setting up the project:

| Tool | Version | Used for |
| --- | --- | --- |
| Node.js | 20 or newer recommended | Web client and TypeScript packages |
| pnpm | 9 | JavaScript workspace and dependencies |
| Python | 3.11 or newer | Optional FastAPI backend and its tests |

The client uses React, Vite, TypeScript, Tailwind CSS, and Vitest. The screening and shared packages are workspace dependencies. The backend uses FastAPI, Uvicorn, Pydantic, SQLAlchemy, and SQLite by default. The dependency manifests are in `package.json`, `client/package.json`, and `server/requirements.txt`.

## Setup and run the web client

From the repository root, install the JavaScript dependencies:

```powershell
corepack enable
corepack prepare pnpm@9 --activate
pnpm install
```

The client uses the local API URL by default. To configure it explicitly, copy the example into the Vite client directory:

```powershell
Copy-Item .env.example client\.env
```

Start the development server:

```powershell
pnpm dev
```

Open <http://localhost:5173> in a browser. The web client can be run by itself; API-backed features need the backend running as described below.

## Setup and run the API (optional)

Open a second PowerShell terminal at the repository root. Create and activate a virtual environment, then install the backend and test dependencies:

```powershell
python -m venv server\.venv
server\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r server\requirements.txt pytest httpx pytest-asyncio
```

Start the API from the repository root:

```powershell
python -m uvicorn app.main:app --app-dir server --reload --port 8000
```

The API is available at <http://localhost:8000>. Interactive API documentation is at <http://localhost:8000/docs>, and the health endpoint is <http://localhost:8000/health>. The server initializes its database tables and loads initial seed data on startup.

`server/.env.example` documents backend settings. The application reads supported settings from environment variables; it does not automatically load an `.env` file. For example, set a database URL in PowerShell before starting the API with `$env:DATABASE_URL = "sqlite:///./sthreecare.db"`.

## Tests and build

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `pnpm test` | Run the screening-engine Vitest tests |
| `pnpm typecheck` | Type-check the workspace packages |
| `pnpm build` | Build the shared package, screening engine, and web client |
| `python -m pytest server/tests` | Run the backend tests (install the test dependencies above first) |
| `python server/scripts/check_no_health_imports.py` | Check the backend health-data boundary |

To create and serve a production client build, run `pnpm build`, then `pnpm --filter client preview`.

## Privacy and safety

The screening engine and its rules are part of the client-side project. The API is intended for care-navigation and community-support features, and includes middleware to reject health-related fields. Review the implementation and your deployment configuration before using the project with real users or sensitive data.

Clinical references for the screening rules are documented in `common/rules/SOURCES.md`. See `LICENSE` for license information.
