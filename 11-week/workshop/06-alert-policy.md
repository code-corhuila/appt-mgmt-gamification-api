# CP7: Burn Rate Alert Policy

## Mathematical Basis of Burn Rate Rules

Burn rate measures how rapidly an error budget is being consumed relative to the 30-day window:

- **SLO Goal:** 99.5% Availability -> Allowed Error Rate `0.5% (0.005)`.
- **Fast Burn Alert (Burn Rate 14.4):**
  - **Budget Spent:** `14.4 * 0.5% = 7.2%` error rate.
  - **Impact:** Consumes 2% of the monthly error budget in 1 hour (`1h / 720h * 14.4 = 2.0%`).
  - **Action:** Triggers `critical` PagerDuty alert page to the on-call engineer immediately.
- **Slow Burn Alert (Burn Rate 6.0):**
  - **Budget Spent:** `6.0 * 0.5% = 3.0%` error rate.
  - **Impact:** Consumes 5% of the monthly error budget in 6 hours (`6h / 720h * 6.0 = 5.0%`).
  - **Action:** Triggers `warning` notification to the team Slack channel and opens a high-priority ticket.

## Excluded Alert Anti-Patterns & Justification

### Anti-Pattern 1: High CPU / Memory Utilization Alerts (`node_cpu_seconds_total > 85%`)
- **Why Excluded:** High resource utilization does not directly imply user degradation. A container operating at 90% CPU but responding in 50ms with 0% errors is healthy. Paging on CPU causes alert fatigue.
- **Alternative:** Monitor saturation gauges on dashboards; alert solely when high CPU degrades the availability or latency SLO.

### Anti-Pattern 2: Single Transient Error Spikes (`http_requests_failed > 1`)
- **Why Excluded:** Transient network glitches or individual client network drops cause momentary error spikes that resolve spontaneously. Paging on single errors creates excessive noise.
- **Alternative:** Multi-window burn rate evaluation (1h / 5m) requiring sustained error rates before waking up on-call personnel.
