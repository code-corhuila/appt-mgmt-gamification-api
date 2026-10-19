# CP6: Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets

## Defined SLOs for Salud Activa

### SLO 1: Availability for Appointment Booking
- **Target:** 99.5% availability over a 30-day rolling window.
- **SLI Definition:** Ratio of successful `POST /api/turnos` HTTP responses (status code `< 500`) to total requests.
- **PromQL Query:**
  ```promql
  sum(rate(appointment_requests_total{route="/api/turnos", outcome="success"}[30d]))
  /
  sum(rate(appointment_requests_total{route="/api/turnos"}[30d]))
  ```

### SLO 2: Latency for Appointment Booking
- **Target:** 95.0% of requests served in `< 300ms` over a 30-day rolling window.
- **SLI Definition:** Ratio of `POST /api/turnos` requests completed within 300ms histogram bucket over total requests.
- **PromQL Query:**
  ```promql
  sum(rate(appointment_request_duration_seconds_bucket{route="/api/turnos", le="0.25"}[30d]))
  /
  sum(rate(appointment_request_duration_seconds_count{route="/api/turnos"}[30d]))
  ```

### SLO 3: Business Outcome (Appointment Notification Dispatch)
- **Target:** 99.0% of confirmed appointments dispatch a patient notification within 60 seconds over 30 days.
- **SLI Definition:** Ratio of successfully processed `AppointmentCreatedEvent` consumer messages to total published events.
- **PromQL Query:**
  ```promql
  sum(rate(notification_events_processed_total{status="success"}[30d]))
  /
  sum(rate(notification_events_received_total[30d]))
  ```

## Traffic Justification & Error Budget Calculation

### Estimated Traffic Model
- **Target User Base:** 15,000 active patients across regional clinics.
- **Daily Request Volume:** ~15,000 requests/day for `POST /api/turnos`.
- **Monthly Volume (30 days):** `15,000 * 30 = 450,000` total requests/month.

### Error Budget Calculations
- **SLO 1 Budget (99.5% Availability):**
  - **Allowed Bad Requests:** `0.5% * 450,000 = 2,250` failed requests/month.
  - **Allowed Total Downtime:** `0.5% * 43,200 minutes = 216 minutes` (3 hours 36 minutes) per month.
- **SLO 2 Budget (95.0% Latency < 300ms):**
  - **Allowed Slow Requests (> 300ms):** `5.0% * 450,000 = 22,500` slow requests/month.

## Error Budget Policy

| Budget Consumed | Trigger Threshold | Team Action & Operational Governance |
| :--- | :--- | :--- |
| **50% Consumed** | 1,125 failed requests or 108 min error budget spent | **Warning state:** Alert team lead; prioritize non-critical bug fixes in current sprint backlog. |
| **75% Consumed** | 1,687 failed requests or 162 min error budget spent | **Elevated state:** Freeze non-essential feature deployments; conduct architecture review of bottleneck components. |
| **100% Consumed** | 2,250 failed requests or 216 min error budget spent | **Hard Freeze:** Halte all new feature deployments immediately; full engineering effort dedicated to system reliability and postmortem execution. |
