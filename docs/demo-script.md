# DeployLens 60-Second Demo Script

## Pitch Narrative Overview

This 60-second walkthrough is structured specifically to make the value of **Hindsight persistent memory** undeniable within 1 minute.

---

## Step-by-Step Script

### 0 - 10 Seconds: The Production Outage
- **Action**: Open the DeployLens Dashboard and click on active incident **INC-2051 (Checkout Error Rate Spike)**.
- **Presenter**:
  > *"When production breaks at 2 AM, SREs face a chaotic dashboard. Right now on NovaCart, checkout error rate jumped from 0.7% to 18.4%. Normally, an engineer would manually search Slack, deployment logs, and old postmortems."*

### 10 - 25 Seconds: The AI Investigator
- **Action**: Click the **"Investigate Incident"** button.
- **Presenter**:
  > *"DeployLens immediately correlates the alert timeline with recent code releases. It discovers that 23 minutes before the outage, payment-service v2.8.1 was deployed, introducing a configuration change: `PAYMENT_REDIS_POOL_SIZE = 20`."*

### 25 - 40 Seconds: Have We Seen This Before? (Hindsight Recall)
- **Action**: Click **"Have We Seen This Before?"**.
- **Presenter**:
  > *"Instead of guessing, DeployLens queries Hindsight—its persistent organizational memory. In seconds, it retrieves INC-1042 with a 91% similarity match from two weeks ago."*

### 40 - 50 Seconds: Failed Fix Memory vs Verified Resolution
- **Action**: Highlight the **Historical Failed Fix Warning** card and **What Worked Before** card.
- **Presenter**:
  > *"Here is why Hindsight is revolutionary: DeployLens remembers that restarting checkout-api was attempted 3 times in past outages and ONLY provided temporary relief before failing again. Instead, it tells the SRE to adjust the Redis pool size to 50—the exact verified fix from last time."*

### 50 - 60 Seconds: Before vs After & Learning Loop
- **Action**: Navigate to **"Before vs After"** or click **"Resolve Incident"**.
- **Presenter**:
  > *"Without memory, AI gives generic troubleshooting advice. With Hindsight, DeployLens remembers how your organization solved yesterday's outage so you fix today's in minutes. DeployLens: Production Change Intelligence That Remembers."*
