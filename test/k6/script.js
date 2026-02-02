import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Global options
 *
 */
export const options = {
  scenarios: {
    steady_load: {
      executor: 'constant-vus',
      vus: 500,
      duration: '5s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% error
    http_req_duration: ['p(95)<500'], // 95% < 500ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  const res = http.get(`${BASE_URL}/users`, {
    tags: {
      service: 'user-service',
      endpoint: 'GET /users',
    },
  });

  console.log(
    `Status: ${res.status} | ` +
      `URL: ${res.request.url} | ` +
      `MESSAGE: ${res.body} | ` +
      `Check200: ${res.status === 200 ? 'PASS' : 'FAIL'} | `,
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
