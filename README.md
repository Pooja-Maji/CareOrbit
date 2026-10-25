# Care Orbit: Life-Stage Health Compass

> A women's health platform that runs validated screening tools for each life stage, connects the results, tells a woman exactly what to do next, and helps her finish that next step with verified community support.

**Authors:** Chaturthi H V, Pooja M
**Live Prototype**
https://careorbitco.netlify.app/

---

## 1. Project Title and Description

**Care Orbit** is a website where a woman sets her life stage and history, runs short validated checks (heavy periods, anaemia, postpartum mood, symptoms), and gets a clear, sourced result. The result:

- explains what the flag means in plain language,
- gives a ready-to-say script for the doctor and safe self-care,
- links to nearby care,
- is saved to a private on-device history.

If practical barriers stand in the way (booking, navigation, language), a verified volunteer can help through the **Healthcare Time Bank**. Follow-ups are tracked until the loop is closed.

**Nothing is diagnosed.** Accuracy comes from validated instruments and published thresholds applied by deterministic rules, not machine learning.

The project has four parts:

| Part | Role |
|---|---|
| **Life-Stage Health Compass** (engine) | Runs validated instruments, connects results, says what to do next. Adding a condition means adding one rule file. |
| **A. Women's Health Intelligence** | Profile, symptom log, timeline, clinician summary |
| **B. Healthcare Time Bank** | Verified volunteers give non-medical practical help. Credits are earned or sponsored and never gate urgent care. |
| **C. Continuity of Care** | Tracks recommended next steps with consent. A Care Gap Identifier gently asks whether help is needed. |

---

## 2. Problem Statement

Women's health problems are rarely failures of treatment alone. They are failures of **recognition, referral and follow-through**.

| Gap | Evidence (India unless stated) |
|---|---|
| Late recognition | Endometriosis diagnosis delays are estimated at 3-7 years |
| Anaemia | 57% of women aged 15-49 are anaemic (NFHS-5), up from 53% |
| Missed screening | Only 1.9% of women have ever had cervical screening, 0.9% a breast exam (NFHS-5) |
| Delay before care | In one study of 317 maternal deaths, delay in seeking care was the largest contributor (48.6%) |
| Unreliable tools | Symptom checkers list the correct diagnosis first only 19-38% of the time |

Several of these studies are small, local or older, so they are cited as "studies found", not national facts. Full source list is in [`common/rules/SOURCES.md`](common/rules/SOURCES.md).

**Core problem:** no one connects what a woman feels, what she should do about it, and who can help her do it.

---

## 3. Target Users

| User | Need |
|---|---|
| **Women across life stages** (teen, adult, pregnant, postpartum, 40+) | Understand symptoms, know when to see a doctor, track over time |
| **Women facing practical barriers** (language, travel, unfamiliar hospitals) | Someone to help with booking, navigation and translation |
| **Volunteers** | A structured, safe way to give non-medical help and earn credits |
| **Clinicians (indirect)** | A concise, sourced summary of what the patient has tracked |

---

## 4. Existing Solutions

| Product | What it does | What it does not do |
|---|---|---|
| [Flo](https://flo.health) | Cycle and symptom tracking, health insights | No volunteer support or follow-up tracking. Insights are not tied to care navigation. |
| [Clue](https://helloclue.com) | Period and cycle tracker | Tracking only, no referral or next-step guidance |
| [Ada](https://ada.com) | AI symptom assessment | Symptom-checker approach, which the literature shows has low diagnostic accuracy. Not women's-health or life-stage specific. |
| [Practo](https://www.practo.com) | Doctor discovery, booking, teleconsultation | Does not screen, track, or help with barriers like navigation or language |
| [e-Sanjeevani](https://esanjeevani.mohfw.gov.in) | Government teleconsultation service | No screening, history, or follow-up loop |
| [Timebanks.org](https://timebanks.org) | Community time-banking model (hours exchanged for hours) | Not health-specific. Our Time Bank adapts the idea to non-medical healthcare help. |

---

## 5. Proposed Solution and Innovation

**Principle:** the platform never diagnoses. It uses validated tools and published thresholds, shows the source of every flag, and routes the woman to the right test or specialist.

**What makes it different**

1. **Connected, not isolated.** Existing products each cover part of the journey. Care Orbit connects validated screening, care navigation, verified community support and follow-up in one loop. Example: a heavy-bleeding score and a haemoglobin value are linked, so the result says heavy bleeding may be contributing to iron deficiency and what to ask the doctor.
2. **Transparent rules, no black box.** Every flag shows its source and the exact versioned rule that fired. Scorers are unit-tested against published worked examples and cross-checked by an independent Python reference.
3. **Closes the loop.** Recommended next steps are tracked, and a gentle Care Gap nudge asks "need help booking?" instead of assuming care was missed.
4. **Healthcare Time Bank.** Volunteers help with booking, navigation and language. Credits are earned or sponsored and never gate urgent care.
5. **Privacy by architecture.** Health data stays on the device (IndexedDB). The server stores only facilities, volunteer tasks (anonymous reference) and credits. A middleware rejects health fields, and a CI check fails the build if the server imports the rules.

**Instruments used**

| Stage or issue | Instrument |
|---|---|
| Periods | PBAC picture chart (score of 100 or more flags heavy bleeding) |
| Anaemia | WHO haemoglobin cut-offs (non-pregnant and pregnant) |
| Pregnancy and postpartum mood | EPDS (threshold 13 or more, self-harm item triggers a support screen) |
| Cancer screening | Age-based reminders and plain explainers |
| Persistent pain, cycle problems | Rule-based escalation to ask for referral or ultrasound |
| Warning signs | Fixed danger-sign list leading to an emergency screen (call 108) |

**Limits stated openly:** PBAC accuracy varies across studies, so it is a screening flag. EPDS is validated for depression, not anxiety. All thresholds and wording must be reviewed by a doctor or medical student before real use. Volunteers do non-medical tasks only. Login is a simulated demo.

---

## 6. MVP Features

The first working version is one connected path, which is the demo:

1. Simulated phone login (fixed test OTP) and consent screen
2. Life-stage chips and short history intake
3. **Heavy-bleeding check** with the Pad Picker (PBAC) and **Hb entry** (WHO cut-offs)
4. **Compass engine** with deterministic rules, connected result, source shown on every flag
5. **Result screen:** threshold gauge, flag cards, "why it fired" drawer, doctor script, self-care
6. **Emergency takeover** (red call-108 screen), never gated by credits
7. **Auto-save to history** with the Care Thread timeline (on-device)
8. **Doctor summary** with a QR code
9. **Find care:** list of facilities, with simulated availability clearly labelled
10. **Request volunteer help** with a task stepper (Requested, Matched, In progress, Verified) and simulated credits
11. **Follow-up and Care Gap nudge**, then the dashboard "Today" card

**Stretch (only after the MVP works):** EPDS mood cards, map view, trend sparklines, compare results, body pain painter, discreet mode, PIN lock, export and delete.

---

## 7. Suited Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18, Vite, TypeScript (strict), Tailwind CSS | Fast to build, strong typing catches errors in health logic, easy mobile-first styling |
| Routing and state | React Router, Zustand | Lightweight, minimal boilerplate for a single-page site |
| Compass engine | Pure TypeScript package (no ML, no DOM) | Deterministic, testable, runs in the browser so health data never leaves the device |
| On-device storage | Dexie (IndexedDB) | Keeps all health data private on the user's device |
| Form validation | Zod | Validates frontend inputs with typed schemas |
| Backend | FastAPI, Pydantic v2, SQLAlchemy 2, Alembic | Quick to build, automatic OpenAPI spec, strict request validation |
| Server database | SQLite (PostgreSQL later) | Zero setup for a prototype, easy to migrate |
| API contract | openapi-typescript + openapi-fetch | Frontend types are generated from the backend, so they cannot drift |
| Rules | JSON rule files + JSON Schema (Ajv, jsonschema) | Language-neutral source of truth shared by TypeScript and Python, versioned and reviewable by clinicians |
| Testing | Vitest, fast-check, Playwright, pytest | Unit tests against published examples, property tests, end-to-end happy path |
| Lint and CI | Biome, Ruff, GitHub Actions | Consistent code and automatic checks on every PR |
| QR, icons, fonts | qrcode, Lucide, Fontsource (self-hosted) | Works offline, no external requests |
| Maps (stretch) | Leaflet + OpenStreetMap | Free, no API key |
| Hosting (free) | Cloudflare Pages / Netlify / Vercel (frontend), local or Render free tier (API) | No cost |

---

## 8. Architectural Flow Diagram
<img width="1148" height="3630" alt="mermaid-diagram-2026-10-25-193155" src="https://github.com/user-attachments/assets/758458a6-3b4b-41ad-a67d-5a7887f6f560" />




**Reading the diagram**

- **Input:** the user logs in, sets a profile and enters a check. A warning sign goes straight to the emergency screen.
- **Processing:** otherwise the Compass engine scores the inputs using the versioned rule files and builds the result with its source.
- **Storage:** results are saved to the on-device database (health data stays on the phone). Only volunteer tasks and credits go to the server, with no health data.
- **Output:** the result, follow-up and dashboard are shown back to the user, and new checks feed back into the loop.

---

## Repository Structure

```
.
├── common/
│   ├── rules/            # JSON rule files + SOURCES.md (shared source of truth)
│   └── verification/     # published test cases read by both TS and Python
├── client/               # React + Vite + TypeScript
│   ├── packages/
│   │   ├── compass/      # engine: no React, no DOM
│   │   └── shared/       # shared types
│   └── src/              # app, design system, features, db, api
├── server/               # FastAPI + SQLite
│   ├── app/              # routers, services, models, middleware
│   ├── reference/        # independent Python scorers (test oracle only)
│   └── tests/
├── scripts/              # cross-cutting scripts (validate rules, compare engines)
└── .github/workflows/    # CI
```

## Getting Started

```bash
pnpm install
pnpm dev          # starts the client (Vite dev server)
pnpm test         # runs the Compass engine tests
```

Backend (from `server/`):

```bash
uv sync
uv run uvicorn app.main:app --reload
uv run pytest
```

> Adjust these commands if your setup differs.

## Safety and Disclaimer

Care Orbit is a **screening and navigation prototype, not a diagnostic tool**. It does not replace a doctor. Urgent warning signs always show an emergency screen (call 108), independent of any credits or steps. Volunteers perform non-medical tasks only. Login, volunteer verification and facility availability are **simulated** in this prototype. All thresholds and wording need review by qualified professionals before real use.
