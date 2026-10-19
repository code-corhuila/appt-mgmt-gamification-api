export function logStructured(level, event, message, traceCtx, extraFields = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'appointments-service',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'qa',
    trace_id: traceCtx ? traceCtx.traceId : '00000000000000000000000000000000',
    span_id: traceCtx ? traceCtx.spanId : '0000000000000000',
    correlation_id: extraFields.correlation_id || `corr-${Date.now()}`,
    event,
    message,
    duration_ms: extraFields.duration_ms || 0,
    patient_id: extraFields.patient_id || 'anonymous',
    slot_id: extraFields.slot_id || 'none'
  };
  console.log(JSON.stringify(logEntry));
  return logEntry;
}
