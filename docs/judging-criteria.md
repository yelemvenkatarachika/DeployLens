# DeployLens Judging Criteria Mapping

This document maps DeployLens features directly to the official hackathon judging categories.

---

## 1. Innovation (30%)
- **Production Change Intelligence**: Shifts AI from generic chatbots to automated production change correlation.
- **Outcome-Aware Operational Memory**: Stores not only what happened, but whether the fix worked or failed.
- **Anti-Pattern & Failed-Fix Memory**: Explicitly warns engineers when a proposed action (e.g. service restart) historically failed.
- **Cross-Incident Pattern Synthesis**: Automatically clusters recurring operational failures across releases.

---

## 2. Hindsight Memory (25%)
- **Persistent Vector Bank**: Uses official `hindsight-client` Python SDK to manage long-term bank `novacart-production-memory`.
- **Semantic Event Categorization**: Transforms operational data into formatted semantic memory units (deployments, incidents, resolutions, anti-patterns).
- **Hindsight Status Visibility**: Visible system status indicators (`Hindsight Connected`, `Hindsight Unavailable`, `Demo Fallback Active`).
- **Memory Explorer (`/memory`)**: Searchable memory explorer displaying memory units, similarity scores, metadata, and growth charts over time.
- **Before vs After Comparison (`/compare`)**: Side-by-side demonstration contrasting stateless RAG vs Hindsight persistent memory.

---

## 3. Technical Implementation (20%)
- **Full-Stack Architecture**: Next.js 15+ App Router frontend coupled with FastAPI Python backend.
- **Strict Validation**: Validated Pydantic v2 investigation schemas ensuring structured JSON output.
- **LLM Reasoning Pipeline**: Multi-stage investigation pipeline leveraging Groq (`qwen-2.5-32b`) and fallback demo reasoning.
- **Automated Seeding**: Complete seed script (`scripts/seed_demo_data.py`) populating SQLite and Hindsight vector bank.
- **Test Coverage**: Pytest suite verifying memory formatting, query building, API routes, and investigator schemas.

---

## 4. User Experience (15%)
- **Restrained Enterprise SaaS Design**: Modern Datadog/Linear-inspired dark UI palette.
- **Contextual Workflows**: AI intelligence embedded cleanly into SRE investigation workflows rather than a generic chat bubble.
- **Multi-Stage Progress Indicators**: Clear visual loading states during multi-step change correlation.
- **Evidence-First Reasoning Ledger**: Clear separation of observed facts, recalled memories, hypotheses, and recommendations.

---

## 5. Real-World Impact (10%)
- **Reduced Mean-Time-To-Resolution (MTTR)**: Cuts incident investigation times from hours to minutes.
- **Preservation of Organizational Knowledge**: Prevents knowledge loss when SREs or senior engineers leave.
- **Elimination of Repeated Mistakes**: Remembers failed fixes so teams don't repeatedly attempt ineffective workarounds.
