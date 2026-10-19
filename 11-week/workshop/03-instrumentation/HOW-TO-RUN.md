# CP3 Instrumentation: How to Run & Verify

This module implements W3C trace context parsing and propagation (`traceparent`), structured logging according to CP2 schema, and Prometheus metrics generation for `appointments-service`.

## Prerequisites
- Node.js v18+ (tested on Node.js v25.8.0)

## How to Execute Automated Tests

Run the unit tests from this directory:

```bash
cd 11-week/workshop/03-instrumentation
npm test
```

## Real Console Execution Output

```text
> appointments-service-instrumentation@2.0.0 test
> node --test

✔ W3C Traceparent parser correctly extracts traceId and parentSpanId (2.4422ms)
✔ Trace Context propagation preserves incoming trace_id to downstream call (1.2465ms)
✔ Prometheus metrics endpoint renders counters and buckets (1.184ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 264.3698
```

## Verification Checklist
- [x] Incoming W3C `traceparent` headers are correctly parsed into `trace_id` and `span_id`.
- [x] Outgoing requests propagate `traceparent` keeping the exact same `trace_id`.
- [x] Structured logs emit valid JSON containing CP2 fields (`trace_id`, `span_id`, `patient_id`, `slot_id`).
- [x] `/metrics` endpoint exports Prometheus counter and histogram bucket metrics.
