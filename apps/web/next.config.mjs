/** Requests to /api/* go to the NestJS API, so the browser never needs CORS. */
const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export default {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }];
  },
};
