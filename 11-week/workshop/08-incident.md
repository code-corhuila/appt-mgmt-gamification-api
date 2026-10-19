# CP9: Simulated Incident Drill & Blameless Postmortem

## Incident Scenario Definition
- **Incident Summary:** Downstream dependency `auth-service` experiences database connection pool contention, resulting in a **3,000ms response delay on 25% of all incoming `POST /api/turnos` requests** for a total duration of **40 minutes**.

## Trace & Log Drill Artifacts

### Trace Span Tree of Latenct Request (`trace_id: 8ff92f3577b34da6a3ce929d0e0e9999`)

```text
trace_id: 8ff92f3577b34da6a3ce929d0e0e9999 (duration: 3042ms)
├── span: api-gateway:HTTP POST /api/turnos [duration: 3042ms]
│   └── span: appointments-service:HTTP POST /api/turnos [duration: 3038ms]
│       └── span: auth-service:HTTP POST /api/v1/auth/verify-token [duration: 3004ms] (TIMEOUT EXCEEDED)
```

### 4 Log Lines for Latent Request

```json
{"timestamp":"2026-10-19T15:00:00.000Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"8ff92f3577b34da6a3ce929d0e0e9999","span_id":"00f067aa0ba902b7","correlation_id":"drill-88121","event":"http.request.received","message":"Incoming appointment booking request","duration_ms":1,"patient_id":"pat-99402","slot_id":"slot-88401"}
{"timestamp":"2026-10-19T15:00:00.002Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"8ff92f3577b34da6a3ce929d0e0e4736","span_id":"02b099cc2db004d9","correlation_id":"drill-88121","event":"auth.token.verify_attempt","message":"Dispatching token verification to auth-service","duration_ms":2,"patient_id":"pat-99402","slot_id":"slot-88401"}
{"timestamp":"2026-10-19T15:00:03.006Z","level":"ERROR","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"8ff92f3577b34da6a3ce929d0e0e9999","span_id":"02b099cc2db004d9","correlation_id":"drill-88121","event":"auth.internal.timeout","message":"auth-service call timed out after 3000ms","duration_ms":3004,"patient_id":"pat-99402","slot_id":"slot-88401"}
{"timestamp":"2026-10-19T15:00:03.010Z","level":"ERROR","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"8ff92f3577b34da6a3ce929d0e0e9999","span_id":"00f067aa0ba902b7","correlation_id":"drill-88121","event":"http.response.error","message":"Request failed with 504 Gateway Timeout","duration_ms":3042,"patient_id":"pat-99402","slot_id":"slot-88401"}
```

## SLI & Alert Behavior during Drill

- **Impacted Latency SLI:** Drops from `98.2%` to **`75.0%`** (25% of traffic exceeds the 300ms SLA target).
- **Triggered Alert:** `AppointmentServiceFastBurnErrorBudget` (Burn Rate 14.4).
- **Time to Alert Trigger:** **Minute 5** of the drill (after meeting the 2-minute `for` evaluation window).
- **Remediation Action:** Execution of Runbook CP8 Mitigation Step 1 (Enabling `ENABLE_AUTH_CACHE_FALLBACK=true` feature flag) at Minute 12, restoring SLI to `99.1%`.

## Blameless Postmortem

### Timeline
- **15:00 UTC:** Drill starts; 25% latency fault injected into `auth-service`.
- **15:02 UTC:** High latency triggers HTTP 504 timeouts at `api-gateway`.
- **15:05 UTC:** `AppointmentServiceFastBurnErrorBudget` fires; PagerDuty alerts on-call engineer.
- **15:08 UTC:** On-call engineer uses CP8 Runbook to confirm `auth-service` timeout in OpenSearch logs via `trace_id`.
- **15:12 UTC:** On-call engineer toggles `ENABLE_AUTH_CACHE_FALLBACK=true`.
- **15:15 UTC:** Error rates drop back to `< 0.2%`. Drill resolved.

### Business & Technical Impact
- **Total Requests Affected:** ~104 failed requests out of 416 total during the 12-minute active window.
- **Error Budget Consumed:** 12 minutes out of the 216-minute monthly availability budget (5.5%).

### Root Cause & Contributing Factors
- **Root Cause:** Missing B-Tree index on `users.auth_token` in `auth-service` causing sequential table scans during peak traffic concurrency.
- **Contributing Factors:** Absence of an automated HTTP circuit breaker with local fallback on `appointments-service`.

### Actionable User Stories (Preventative Work)

1. **HU-OBS-001 (Circuit Breaker Implementation):**
   - *User Story:* As a backend engineer, I want `appointments-service` to use a circuit breaker when calling `auth-service`, so that downstream slow requests do not cascade and block the appointment booking thread pool.
   - *Acceptance Criteria:*
     1. Circuit breaker opens automatically after 5 consecutive HTTP timeouts (> 2000ms).
     2. Open circuit breaker returns cached JWT verification without calling network.

2. **HU-OBS-002 (Database Indexing Optimization):**
   - *User Story:* As a database administrator, I want to add a unique index on `auth_tokens` in `auth-service`, so that token verification latency remains under 10ms regardless of active sessions.
   - *Acceptance Criteria:*
     1. PostgreSQL migration script creates index `idx_users_auth_token`.
     2. Query execution plan shows index scan with `cost < 1.0`.

3. **HU-OBS-003 (Automated Canary Rollbacks):**
   - *User Story:* As a DevOps engineer, I want AWS ECS to trigger automated rollbacks when the burn rate alert fires, so that degraded releases are reverted without requiring manual intervention.
   - *Acceptance Criteria:*
     1. CloudWatch alarm triggers ECS deployment rollback when `AppointmentServiceFastBurnErrorBudget` state turns `ALARM`.
