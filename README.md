# DeployLens: Production Change Intelligence That Remembers

> **DeployLens** is a memory-powered production incident investigation agent for DevOps and SRE teams powered by **Hindsight by Vectorize**.

---

## The Problem & The Core Concept

When production breaks, engineering teams scramble across Git commits, CI/CD logs, deployment records, metrics, and Slack threads asking:
- *What changed before production broke?*
- *Have we seen this failure pattern before?*
- *What actually worked last time—and what failed?*

DeployLens turns previous incidents and postmortems into **organizational memory**. Over time, the agent becomes significantly more useful because it remembers the organization's operational history.

---

## Key Features

1. **Change Investigator (Hero Feature 1)**: Correlates active incidents with recent deployments, config diffs, and Hindsight historical memories.
2. **Have We Seen This Before? (Hero Feature 2)**: Vector recall against Hindsight memory bank (`novacart-production-memory`) returning similarity scores and previous root causes.
3. **Correlated Memory Timeline (Hero Feature 3)**: Visual timeline combining deployments, config changes, alerts, investigations, and resolutions.
4. **Failed Fix Memory (Hero Feature 4)**: Explicitly warns SREs about actions (like restarting services) that historically failed or provided temporary relief only.
5. **Incident Learning Loop (Hero Feature 5)**: Resolving an incident saves relational state AND writes new semantic memories to Hindsight.
6. **Memory Explorer (`/memory`)**: Live searchable catalog of Hindsight memories, metadata, and memory growth charts.
7. **Before vs After Comparison (`/compare`)**: Side-by-side mode proving why persistent Hindsight memory fundamentally beats generic AI.
8. **Discovered Operational Patterns (`/patterns`)**: Synthesized cross-incident rules and anti-patterns.

---

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: FastAPI (Python 3.12), Pydantic v2, SQLAlchemy.
- **Database**: SQLite (`backend/data/deploylens.db`).
- **Memory Layer**: Hindsight by Vectorize (`hindsight-client`).
- **LLM Reasoning**: Groq API (`qwen-2.5-32b` or configured model).

---

## Quick Start Guide

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys (optional; if omitted, DeployLens operates in deterministic demo mode):
```env
GROQ_API_KEY=your_groq_api_key
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=novacart-production-memory
LLM_MODEL=qwen-2.5-32b
```

### 3. Seed Database & Hindsight Memory Bank
```bash
python scripts/seed_demo_data.py
```

### 4. Run Backend
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --app-dir backend
```
Backend API will be available at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 5. Run Frontend
```bash
cd frontend
npm run dev
```
Frontend UI will be available at: `http://localhost:3000`.

---

## Running Tests

Run the Pytest suite for backend memory formatting, query building, API routes, and agent schemas:
```bash
python -m pytest backend/tests
```

---

## Project Structure

```
deploylens/
├── frontend/             # Next.js 15 TypeScript Frontend
│   ├── app/              # App Router routes (/, /incidents, /deployments, /memory, /compare, /patterns)
│   ├── components/       # UI components (InvestigationView, TimelineView, MemoryCard, etc.)
│   ├── lib/              # API client & utilities
│   └── types/            # TypeScript interface definitions
├── backend/              # FastAPI Python Backend
│   ├── app/
│   │   ├── api/          # REST API endpoints
│   │   ├── agents/       # Incident Investigator Agent & Prompts
│   │   ├── memory/       # Hindsight Client, Memory Service & Formatter
│   │   ├── models/       # SQLAlchemy domain models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   └── core/         # Settings configuration
│   ├── data/             # SQLite database file
│   └── tests/            # Pytest test suite
├── scripts/              # Seed scripts (seed_demo_data.py)
├── docs/                 # Documentation (architecture, hindsight-memory, demo-script, judging-criteria)
├── .env.example
├── docker-compose.yml
└── README.md
```
