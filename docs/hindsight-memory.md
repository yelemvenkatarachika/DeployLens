# Hindsight Memory Integration Specification

## Why Hindsight is Central to DeployLens

Standard Retrieval-Augmented Generation (RAG) applications perform static similarity search over static documentation or code bases. However, **production incidents are dynamic and experiential**. 

When an outage occurs, SREs need an agent that:
1. Remembers how past incidents were actually resolved.
2. Warns engineers about actions that **failed** in previous outages (e.g. restarting a service that only gave 8 minutes of temporary relief).
3. Consolidates facts over time as new postmortems and deployment records are submitted.

DeployLens leverages **Hindsight by Vectorize** as its core long-term experiential memory layer.

---

## Memory Bank Configuration

- **Bank ID**: `novacart-production-memory`
- **SDK Package**: `hindsight-client` (Python SDK v0.10+)
- **API Base URL**: Configurable via `HINDSIGHT_BASE_URL` (default: `https://api.hindsight.vectorize.io`)

---

## Semantic Memory Categories

DeployLens categorizes long-term operational memories into 6 distinct semantic types:

1. **Deployment Memory**:
   - *Example*: `"On August 17 at 14:03, payment-service version 2.7.4 was deployed to production by Maya Chen. The deployment changed Redis connection handling and introduced PAYMENT_REDIS_POOL_SIZE=20."`
2. **Incident Memory**:
   - *Example*: `"INC-1042 affected checkout-api on August 17. Checkout latency increased from 420ms to 2.8 seconds and HTTP 5xx errors reached 17%."`
3. **Investigation Memory**:
   - *Example*: `"During INC-1042, restarting checkout-api temporarily reduced latency but the problem returned within eight minutes."`
4. **Resolution Memory**:
   - *Example*: `"INC-1042 was resolved by increasing payment-service Redis connection pool size from 20 to 50. Error rate returned below 1% within six minutes."`
5. **Failure / Anti-pattern Memory**:
   - *Example*: `"Restarting checkout-api has historically provided temporary recovery but has not permanently resolved Redis pool exhaustion."`
6. **Learning Memory**:
   - *Example*: `"For checkout incidents involving Redis timeout warnings after payment deployments, checking connection pool configuration is more effective than restarting checkout-api."`

---

## Life Cycle of a Memory Unit

```
Production Outage
       │
       ▼
Incident Declared (INC-2051)
       │
       ▼
DeployLens Agent Queries Hindsight (`recall_memories()`)
       │
       ▼
Agent Reasons with Current Facts + Hindsight Historical Matches (INC-1042)
       │
       ▼
Engineer Applies Verified Fix (PAYMENT_REDIS_POOL_SIZE = 50)
       │
       ▼
Incident Resolved -> User Submits Resolution
       │
       ▼
`store_incident_outcome()` executes `hindsight_client.retain()`
       │
       ▼
New Memory Unit written to `novacart-production-memory`
       │
       ▼
Future Incidents query updated organizational memory bank!
```
