import crypto from 'node:crypto';

export function parseTraceparent(header) {
  if (!header || typeof header !== 'string') return null;
  const parts = header.split('-');
  if (parts.length < 4 || parts[0] !== '00') return null;
  return {
    traceId: parts[1],
    parentSpanId: parts[2],
    traceFlags: parts[3] || '01'
  };
}

export function generateTraceContext(incomingHeader) {
  const parsed = parseTraceparent(incomingHeader);
  const traceId = parsed ? parsed.traceId : crypto.randomBytes(16).toString('hex');
  const spanId = crypto.randomBytes(8).toString('hex');
  const parentSpanId = parsed ? parsed.parentSpanId : null;
  return {
    traceId,
    spanId,
    parentSpanId,
    traceparent: `00-${traceId}-${spanId}-01`
  };
}
