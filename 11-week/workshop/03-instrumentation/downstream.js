export async function callDownstreamService(url, traceCtx, payload) {
  const headers = {
    'Content-Type': 'application/json',
    'traceparent': traceCtx ? traceCtx.traceparent : '00-00000000000000000000000000000000-0000000000000000-01'
  };

  // Mock downstream HTTP request for unit testing and demo
  return {
    status: 200,
    headers,
    data: { status: 'SUCCESS', verified: true }
  };
}
