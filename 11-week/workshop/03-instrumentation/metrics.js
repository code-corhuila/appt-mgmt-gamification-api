const requestCounters = {};
const durationBuckets = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
const histogramData = [];

export function recordMetrics(route, outcome, durationSeconds) {
  const key = `route="${route}",outcome="${outcome}"`;
  requestCounters[key] = (requestCounters[key] || 0) + 1;
  histogramData.push({ route, durationSeconds });
}

export function renderPrometheusMetrics() {
  let output = '# HELP appointment_requests_total Total number of appointment HTTP requests.\n';
  output += '# TYPE appointment_requests_total counter\n';
  for (const [key, count] of Object.entries(requestCounters)) {
    output += `appointment_requests_total{${key}} ${count}\n`;
  }

  output += '\n# HELP appointment_request_duration_seconds Appointment request duration in seconds.\n';
  output += '# TYPE appointment_request_duration_seconds histogram\n';
  for (const le of durationBuckets) {
    const count = histogramData.filter(h => h.durationSeconds <= le).length;
    output += `appointment_request_duration_seconds_bucket{le="${le}"} ${count}\n`;
  }
  output += `appointment_request_duration_seconds_bucket{le="+Inf"} ${histogramData.length}\n`;
  output += `appointment_request_duration_seconds_count ${histogramData.length}\n`;
  return output;
}
