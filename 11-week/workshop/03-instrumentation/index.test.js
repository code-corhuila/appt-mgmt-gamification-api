import { test } from 'node:test';
import assert from 'node:assert';
import { parseTraceparent, generateTraceContext } from './tracer.js';
import { callDownstreamService } from './downstream.js';
import { recordMetrics, renderPrometheusMetrics } from './metrics.js';

test('W3C Traceparent parser correctly extracts traceId and parentSpanId', () => {
  const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
  const parsed = parseTraceparent(header);
  assert.strictEqual(parsed.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
  assert.strictEqual(parsed.parentSpanId, '00f067aa0ba902b7');
});

test('Trace Context propagation preserves incoming trace_id to downstream call', async () => {
  const incomingHeader = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
  const traceCtx = generateTraceContext(incomingHeader);

  assert.strictEqual(traceCtx.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
  assert.notStrictEqual(traceCtx.spanId, '00f067aa0ba902b7');

  const downstream = await callDownstreamService('http://auth-service/verify', traceCtx, {});
  const downstreamTraceparent = downstream.headers['traceparent'];

  const downstreamParsed = parseTraceparent(downstreamTraceparent);
  assert.strictEqual(downstreamParsed.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
});

test('Prometheus metrics endpoint renders counters and buckets', () => {
  recordMetrics('/api/turnos', 'success', 0.12);
  const metricsOutput = renderPrometheusMetrics();

  assert.ok(metricsOutput.includes('appointment_requests_total{route="/api/turnos",outcome="success"}'));
  assert.ok(metricsOutput.includes('appointment_request_duration_seconds_bucket{le="0.25"} 1'));
});
