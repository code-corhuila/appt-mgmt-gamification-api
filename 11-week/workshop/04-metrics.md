# CP4: Golden Signals & Metric Catalog

## Metric Catalog for `appointments-service`

| Signal | Metric Name | Metric Type | Labels | PromQL Query |
| :--- | :--- | :--- | :--- | :--- |
| **Latency** | `appointment_request_duration_seconds` | Histogram | `route`, `method`, `le` | `histogram_quantile(0.95, sum by (le) (rate(appointment_request_duration_seconds_bucket[5m])))` |
| **Traffic** | `appointment_requests_total` | Counter | `route`, `method` | `sum(rate(appointment_requests_total[5m]))` |
| **Errors** | `appointment_requests_failed_total` | Counter | `route`, `error_type`, `status_code` | `sum(rate(appointment_requests_failed_total[5m]))` / `sum(rate(appointment_requests_total[5m]))` |
| **Saturation** | `appointment_db_pool_active_connections` | Gauge | `pool_name`, `db_host` | `appointment_db_pool_active_connections / appointment_db_pool_max_connections` |

## Metric Catalog for `api-gateway`

| Signal | Metric Name | Metric Type | Labels | PromQL Query |
| :--- | :--- | :--- | :--- | :--- |
| **Latency** | `gateway_request_duration_seconds` | Histogram | `service`, `method`, `le` | `histogram_quantile(0.99, sum by (le) (rate(gateway_request_duration_seconds_bucket[5m])))` |
| **Traffic** | `gateway_requests_total` | Counter | `service`, `method` | `sum(rate(gateway_requests_total[5m]))` |
| **Errors** | `gateway_requests_total` | Counter | `service`, `status_code` | `sum(rate(gateway_requests_total{status_code=~"5.."}[5m]))` |
| **Saturation** | `gateway_active_requests` | Gauge | `service` | `sum(gateway_active_requests)` |

## Label Cardinality Analysis & Restrictions

| Prohibited Unbounded Label | Cardinality Impact | Bounded Replacement Label | Max Cardinality |
| :--- | :--- | :--- | :--- |
| `patient_id` / `user_id` | Hundreds of thousands of distinct values; explodes TSDB memory. | Removed from metric labels (tracked exclusively via trace logs). | 0 (Log only) |
| `raw_url` (e.g., `/api/turnos/apt-55012`) | High cardinality due to URL route parameters. | Templated `route` (e.g., `/api/turnos/{id}`). | < 15 routes |
| `patient_email` | Infinite unique values. | `auth_status` (`authenticated` / `anonymous`). | 2 |

## Latency Histogram Bucket Selection & Justification

**Buckets configured for `appointment_request_duration_seconds_bucket`:**
`[0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]` (seconds)

**Justification:**
1. **0.05s - 0.1s (50ms - 100ms):** Expected response time for cache hits and availability check queries.
2. **0.25s (250ms):** Target 95th percentile SLA for synchronous appointment booking transactions.
3. **0.5s - 1.0s (500ms - 1s):** Acceptable limit during high-demand scheduling windows.
4. **2.5s - 5.0s:** Threshold triggering client timeouts and fast-burn alert evaluation.
