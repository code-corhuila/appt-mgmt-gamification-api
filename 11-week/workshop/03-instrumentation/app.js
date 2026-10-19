import http from 'node:http';
import { generateTraceContext } from './tracer.js';
import { logStructured } from './logger.js';
import { callDownstreamService } from './downstream.js';
import { recordMetrics, renderPrometheusMetrics } from './metrics.js';

export function createServer() {
  return http.createServer(async (req, res) => {
    const startTime = Date.now();
    const incomingTrace = req.headers['traceparent'];
    const traceCtx = generateTraceContext(incomingTrace);

    res.setHeader('traceparent', traceCtx.traceparent);

    if (req.method === 'GET' && req.url === '/metrics') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(renderPrometheusMetrics());
      return;
    }

    if (req.method === 'POST' && req.url === '/api/turnos') {
      const downstreamResponse = await callDownstreamService('http://auth-service/api/v1/auth/verify-token', traceCtx, {});
      const durationMs = Date.now() - startTime;

      recordMetrics('/api/turnos', 'success', durationMs / 1000);
      logStructured('INFO', 'appointment.creation.requested', 'Processed appointment creation request', traceCtx, {
        duration_ms: durationMs,
        patient_id: 'pat-99402',
        slot_id: 'slot-88401'
      });

      res.writeHead(202, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ACCEPTED',
        appointment_id: 'apt-55012',
        trace_id: traceCtx.traceId,
        downstream_sent_traceparent: downstreamResponse.headers['traceparent']
      }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });
}
