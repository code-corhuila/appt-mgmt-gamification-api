import { generateTraceContext } from './tracer.js';
import { logStructured } from './logger.js';

export function traceMiddleware(req, res, next) {
  const startTime = Date.now();
  const incomingHeader = req.headers['traceparent'];
  const traceCtx = generateTraceContext(incomingHeader);

  req.traceCtx = traceCtx;
  res.setHeader('traceparent', traceCtx.traceparent);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    logStructured(level, 'http.request.completed', `${req.method} ${req.url} completed with status ${res.statusCode}`, traceCtx, {
      duration_ms: duration
    });
  });

  next();
}
