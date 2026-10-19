# CP8: Runbook - Fast Burn Rate Alert Remediation

## Operational Overview
- **Alert Name:** `AppointmentServiceFastBurnErrorBudget`
- **Severity:** Critical (PagerDuty Page)
- **Target Service:** `appointments-service`
- **Trigger Condition:** Error budget burning at `> 14.4x` rate (`> 7.2%` error rate on `POST /api/turnos` over 5m/1h windows).
- **Target SLA Resolution Time:** < 15 minutes.

## Step 1: Immediate Triage & Diagnostic Confirmation

### 1. Execute Diagnostic PromQL Query
Verify current error rate and active request volume in Grafana:
```promql
sum(rate(appointment_requests_failed_total{route="/api/turnos"}[5m]))
/
sum(rate(appointment_requests_total{route="/api/turnos"}[5m]))
```

### 2. Inspect Structured Trace Logs
Query Centralized Logging (OpenSearch / Loki) for recent `ERROR` events sharing `event="auth.internal.timeout"` or `event="http.response.error"`:
```text
service:"appointments-service" AND level:"ERROR" AND event:"http.response.error"
```
*Locate a sample `trace_id` (e.g., `4bf92f3577b34da6a3ce929d0e0e4736`) and trace the full hop breakdown to isolate whether the failure originates in DB lock timeouts, `auth-service` delays, or container memory saturation.*

## Step 2: Mitigation Actions (Ordered by Risk)

### Mitigation 1: Enable Downstream Fallback / Circuit Breaker (Low Risk)
If logs indicate downstream `auth-service` timeouts exceeding 3000ms:
1. Open LaunchDarkly / AWS AppConfig.
2. Toggle feature flag `ENABLE_AUTH_CACHE_FALLBACK=true`.
3. Verify that `appointments-service` uses local JWT signature validation rather than synchronous HTTP calls to `auth-service`.

### Mitigation 2: Horizontal Container Auto-Scaling & Connection Flush (Medium Risk)
If database connection pool saturation is detected (`appointment_db_pool_active_connections == max`):
1. Execute AWS ECS CLI command to increase task count:
   ```bash
   aws ecs update-service --cluster salud-activa-prod --service appointments-service --desired-count 6
   ```
2. Restart stagnant connection pools using AWS RDS proxy reset if locks persist.

### Mitigation 3: Container Rollback to Previous Deployment (High Risk)
If errors started immediately following a recent deployment:
1. Roll back ECS task definition to the previous stable release tag:
   ```bash
   aws ecs update-service --cluster salud-activa-prod --service appointments-service --task-definition appointments-service:42
   ```

## Step 3: Escalation Matrix

| Tier | Role / Contact | Trigger Condition |
| :--- | :--- | :--- |
| **Tier 1** | Primary On-Call Engineer | Initial page trigger (Minutes 0 - 10). |
| **Tier 2** | Backend Lead Architect | Unresolved after 15 minutes or 50% error budget exhausted. |
| **Tier 3** | VP of Engineering | Unresolved after 30 minutes; incident affecting > 5,000 active users. |

## Step 4: Verification of Recovery

1. Confirm error rate drops below `0.5%` on Grafana panel:
   ```promql
   sum(rate(appointment_requests_failed_total{route="/api/turnos"}[5m])) < 0.005
   ```
2. Verify `/health` probe returns `200 OK` across all running ECS container tasks.
3. Close PagerDuty incident and initiate CP9 Blameless Postmortem.
