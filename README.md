# Agent Evaluation Dashboard

A full-stack observability dashboard for tracking LLM agent performance, accuracy, latency, cost, and schema compliance — across models and evaluation runs. Built as a portfolio project to demonstrate a complete, authenticated full-stack application with a custom-designed UI.

![Status](https://img.shields.io/badge/status-MVP-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Overview

Teams running LLM-powered agents in production need visibility into how those agents actually perform — not just whether they work, but how fast, how expensive, and how reliably they return well-structured output. This dashboard simulates that observability layer: eval run history, model comparisons, cost tracking, and pass/fail rates, all behind a real login system.

<img width="1639" height="826" alt="image" src="https://github.com/user-attachments/assets/bfdac138-53b4-48aa-a53b-f1f02f8ba232" />

<img width="1637" height="747" alt="image" src="https://github.com/user-attachments/assets/c5a51d71-e3f6-490a-afaf-2ce055f33891" />

<img width="1633" height="800" alt="image" src="https://github.com/user-attachments/assets/d29b67af-cb24-4557-b235-091b677c40af" />


## Features

- **Live dashboard overview** — accuracy vs. latency trend chart, key metrics (avg. TTFT, total runs, API cost, schema pass rate)
- **Eval run history** — filterable table of individual evaluation runs with per-run accuracy, latency, and cost
- **Model comparison** — side-by-side performance stats across Claude, GPT-4o, and Gemini
- **Request logs** — a scrollable, terminal-style feed of API requests with status codes and durations
- **Authentication** — token-based login/logout, protected API routes, protected dashboard routes
- **Settings panel** — editable profile fields and notification toggles
- **Fully responsive** — collapsible drawer sidebar on mobile, reflowing grid layout across breakpoints

## Tech Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for the accuracy/latency chart
- [Lucide React](https://lucide.dev/) for icons
- TypeScript throughout

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- Token-based session auth (in-memory, hashed passwords)
- Mock data generators simulating real eval telemetry



## Project Structure

```
agent-eval-dashboard/
├── backend/
│   ├── main.py              # FastAPI app, auth, and mock data endpoints
│   ├── requirements.txt
│   └── venv/                 (gitignored)
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # Main dashboard (protected)
    │   │   ├── login/page.tsx     # Login page
    │   │   └── layout.tsx
    │   ├── components/           # Sidebar, charts, cards, views, etc.
    │   └── lib/
    │       ├── api.ts            # Authenticated fetch helpers
    │       ├── auth.ts           # Login/logout/session logic
    │       └── auth-context.tsx  # React auth context/provider
    └── package.json
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/Syeda-Fiza-Gilani/agent-eval-dashboard.git
cd agent-eval-dashboard
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\Activate.ps1      # Windows PowerShell
source venv/bin/activate       # macOS / Linux

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`. Interactive docs available at `http://localhost:8000/docs`.

### 3. Frontend setup

In a **new terminal**:

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then run:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

### 4. Log in

```
Username: admin
Password: admin123
```

> Sessions and users are stored in-memory on the backend — restarting the backend server clears them.

## API Endpoints

| Method | Endpoint             | Auth required | Description                         |
|--------|-----------------------|:---:|--------------------------------------|
| POST   | `/api/auth/login`     | ❌ | Log in, returns a session token       |
| POST   | `/api/auth/logout`    | ✅ | Invalidate the current session        |
| GET    | `/api/auth/me`        | ✅ | Get the current logged-in user        |
| GET    | `/api/stats`          | ✅ | Key metric cards data                 |
| GET    | `/api/chart`          | ✅ | Accuracy/latency time series          |
| GET    | `/api/recent-runs`    | ✅ | Recent test run summaries             |
| GET    | `/api/agents`         | ✅ | Per-agent success rate data           |
| GET    | `/api/models`         | ✅ | Model comparison stats                |
| GET    | `/api/eval-runs`      | ✅ | Full eval run history                 |
| GET    | `/api/logs`           | ✅ | Request log feed                      |

## Roadmap

- [ ] Move from in-memory storage to SQLite for persistent users/sessions
- [ ] Real profile picture upload
- [ ] Signup flow (currently a single seeded admin user)
- [ ] Persist settings/notification preferences to the backend
- [ ] Deploy live (Vercel for frontend, Render/Railway for backend)

## License

MIT — free to use, modify, and learn from.
