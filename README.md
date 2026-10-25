# CareOrbit – Women's Healthcare Support Platform

CareOrbit is a women's healthcare support platform designed to help women understand and track health concerns across different life stages and find support when needed.

## Project Overview

The project brings together three main features:

- **Life-stage health guidance:** Provides structured screening and general guidance based on information entered by the user. It is not a medical diagnosis.
- **Health tracking and follow-up:** Helps users record health information over time and keep track of recommended next steps.
- **Community support and Time Bank:** Connects users with practical, non-medical help such as appointment assistance and hospital navigation. Volunteers can earn time credits for helping others and use eligible credits to request support.
- **Find care:** Helps users explore healthcare facilities and available services.

**Privacy approach:** Health tracking information is intended to remain on the user's device. The backend supports non-medical services such as facility information, support requests, and Time Bank credits; it is not intended to store personal health records.

## Technologies Used

### Frontend
- React and TypeScript
- Vite
- Tailwind CSS
- React Router
- IndexedDB using Dexie for local data storage
- Vitest for tests

### Backend
- Python 3.11 or later
- FastAPI and Uvicorn
- SQLAlchemy
- SQLite database
- Pytest for backend tests

### Package management
- Node.js and pnpm

## Requirements

Install the following before running the project:

- Node.js (18 or later recommended)
- pnpm
- Python 3.11 or later
- pip

## Setup and Run

### 1. Download the project

Extract the project folder and open a terminal in the project root (the folder containing `package.json` and `pnpm-workspace.yaml`).

### 2. Install frontend dependencies

```bash
pnpm install
```

If pnpm is not installed, install it using:

```bash
npm install -g pnpm
```

### 3. Start the frontend

From the project root, run:

```bash
pnpm dev
```

Open the local URL shown in the terminal. By default, Vite uses `http://localhost:5173`.

### 4. Set up and start the backend

Open a **second terminal** in the project root.

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r server/requirements.txt
```

Start the API server from the project root:

```bash
python -m uvicorn app.main:app --app-dir server --reload --port 8000
```

The API will be available at `http://localhost:8000`. Open `http://localhost:8000/docs` to view and test the API endpoints.

The frontend defaults to connecting to `http://localhost:8000`. If needed, create a `client/.env` file and add:

```env
VITE_API_URL=http://localhost:8000
```

Restart the frontend after changing environment variables.

## Useful Commands

Run these commands from the project root:

```bash
pnpm test       # Run Compass engine tests
pnpm build      # Build the frontend and shared packages
pnpm typecheck  # Check TypeScript types
```

To run backend tests, install the development test dependencies and run:

```bash
pip install pytest httpx pytest-asyncio
python -m pytest server/tests
```

## Important Note

CareOrbit is a support and health-guidance tool, not a replacement for a qualified healthcare professional. Screening results should not be treated as a diagnosis. Seek professional medical advice for health concerns and urgent medical help in an emergency.
