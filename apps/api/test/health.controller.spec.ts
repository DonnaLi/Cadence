import { HealthController } from '../src/health/health.controller';
import { HealthReport, HealthService } from '../src/health/health.service';

const report = (overrides: Partial<HealthReport>): HealthReport => ({
  status: 'ok',
  mongo: 'up',
  redis: 'up',
  queue: { waiting: 0, delayed: 0, failed: 0 },
  checkedAt: new Date().toISOString(),
  ...overrides,
});

const fakeRes = () => {
  const res = { statusCode: 200, status: jest.fn() };
  res.status.mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  return res;
};

describe('HealthController', () => {
  it('returns 200 when everything is up', async () => {
    const service = { check: jest.fn().mockResolvedValue(report({})) } as unknown as HealthService;
    const res = fakeRes();
    const body = await new HealthController(service).get(res as never);
    expect(body.status).toBe('ok');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 503 when a dependency is down', async () => {
    const down = report({ status: 'degraded', redis: 'down', queue: null });
    const service = { check: jest.fn().mockResolvedValue(down) } as unknown as HealthService;
    const res = fakeRes();
    const body = await new HealthController(service).get(res as never);
    expect(body.redis).toBe('down');
    expect(res.statusCode).toBe(503);
  });
});
