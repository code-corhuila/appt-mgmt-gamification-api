# CP2: Structured Log Contract

## Field Schema Table

| Field Name | Type | Required / Optional | Example Value | Description & Justification |
| :--- | :--- | :--- | :--- | :--- |
| `timestamp` | String (ISO-8601) | Required | `2026-10-19T14:02:11.482Z` | UTC timestamp with millisecond precision for chronological event ordering across microservices. |
| `level` | String | Required | `ERROR` | Log severity level (`ERROR`, `WARN`, `INFO`, `DEBUG`). |
| `service` | String | Required | `appointments-service` | Microservice issuing the log statement (`api-gateway`, `auth-service`, `appointments-service`, `notification-service`). |
| `version` | String | Required | `2.0.0` | Semantic version of the service deployment for release correlation. |
| `environment` | String | Required | `qa` | Runtime environment (`dev`, `qa`, `staging`, `production`). |
| `trace_id` | String | Required | `4bf92f3577b34da6a3ce929d0e0e4736` | W3C trace identifier linking all log entries belonging to a single end-to-end request. |
| `span_id` | String | Required | `02b099cc2db004d9` | W3C span identifier representing the current execution context. |
| `correlation_id` | String | Required | `appt-req-88121` | Domain correlation key generated at ingress for business transaction auditing. |
| `event` | String | Required | `appointment.creation.requested` | Machine-readable dotted event identifier for targeted filtering and alerting. |
| `message` | String | Required | `Processing appointment reservation request` | Human-readable log message providing context. |
| `duration_ms` | Number | Required | `125` | Execution latency in milliseconds for performance profiling. |
| **`patient_id`** | String | Required (Domain) | `pat-99402` | Anonymized domain identifier of the patient making the booking. |
| **`appointment_id`**| String | Optional (Domain) | `apt-55012` | Domain identifier of the generated or target appointment. |
| **`doctor_id`** | String | Optional (Domain) | `doc-10204` | Identifier of the medical specialist assigned to the time slot. |
| **`specialty`** | String | Optional (Domain) | `Cardiology` | Medical specialty associated with the appointment request. |
| **`slot_id`** | String | Required (Domain) | `slot-88401` | Time slot identifier being reserved or queried. |

## Sensitive Data & Masking Policy (Healthcare Domain)

| Data Category | Sensitive Fields | Policy | Masking Technique |
| :--- | :--- | :--- | :--- |
| Authentication | Passwords, refresh tokens, JWTs | OMIT | Excluded from log payloads at middleware level. |
| Personal Identifiers | National ID (`cédula`), Full Name | MASK | Replaced with salted SHA-256 hash or `[REDACTED_PII]`. |
| Payment / Financial | Credit card numbers, CVV | OMIT | Never processed or logged within core services. |
| Medical Info | Diagnostic details, prescription notes | MASK | Obfuscated as `[REDACTED_PHI]` (Protected Health Information). |

## 7 Sample JSON Log Lines (Identical `trace_id`: `4bf92f3577b34da6a3ce929d0e0e4736`)

```json
{"timestamp":"2026-10-19T14:00:00.000Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"appt-req-88121","event":"http.request.received","message":"Incoming POST /api/turnos request","duration_ms":2,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:00.005Z","level":"INFO","service":"auth-service","version":"1.2.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"01a088bb1ca903c8","correlation_id":"appt-req-88121","event":"auth.token.verified","message":"Patient JWT token successfully validated","duration_ms":12,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:00.020Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"02b099cc2db004d9","correlation_id":"appt-req-88121","event":"appointment.slot.lock_attempt","message":"Attempting database lock for requested slot","duration_ms":15,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:03.025Z","level":"ERROR","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"02b099cc2db004d9","correlation_id":"appt-req-88121","event":"auth.internal.timeout","message":"Timeout of 3000ms exceeded while verifying secondary permissions with auth-service","duration_ms":3004,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:03.030Z","level":"WARN","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"02b099cc2db004d9","correlation_id":"appt-req-88121","event":"appointment.conflict.detected","message":"Slot conflict detected: slot-88401 already reserved by another patient","duration_ms":5,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:03.035Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"04d111ee4fd206fb","correlation_id":"appt-req-88121","event":"appointment.event.published","message":"Published AppointmentFailedEvent to RabbitMQ exchange","duration_ms":4,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
{"timestamp":"2026-10-19T14:00:03.040Z","level":"ERROR","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"appt-req-88121","event":"http.response.error","message":"Request failed with 409 Conflict due to appointment slot collision","duration_ms":3042,"patient_id":"pat-99402","slot_id":"slot-88401","specialty":"Cardiology"}
```

## Severity Level Definitions

- **`ERROR`**: Critical failures requiring immediate or automated intervention (e.g., database connection loss, unhandled exceptions, downstream service timeout exceeding SLA).
- **`WARN`**: Non-fatal operational anomalies or business rule rejections (e.g., slot already reserved 409 Conflict, rate-limit reached, high latency threshold crossed).
- **`INFO`**: Significant normal state transitions and completed transactions (e.g., appointment successfully persisted, user authenticated, domain event published).
- **`DEBUG`**: Detailed diagnostic statements for local/QA troubleshooting (e.g., SQL query execution plan, raw token header metadata, internal state machine payload).
