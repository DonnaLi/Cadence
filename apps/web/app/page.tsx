'use client';

import { useCallback, useEffect, useState } from 'react';

type Status = 'up' | 'down';
interface Health {
  status: 'ok' | 'degraded';
  mongo: Status;
  redis: Status;
  queue: { waiting: number; delayed: number; failed: number } | null;
  checkedAt: string;
}

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      setHealth(await res.json());
      setError('');
    } catch {
      setHealth(null);
      setError('Cannot reach the API. Start it with: npm run dev:api');
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <main className="wrap">
      <h1>Cadence</h1>
      <p className="lead">Milestone 1: the web app, API, MongoDB, and Redis are talking to each other.</p>

      {error && <p className="error">{error}</p>}

      {health && (
        <ul className="checks">
          <li className={health.mongo}>
            <span>MongoDB</span>
            <strong>{health.mongo}</strong>
          </li>
          <li className={health.redis}>
            <span>Redis</span>
            <strong>{health.redis}</strong>
          </li>
          <li className={health.queue ? 'up' : 'down'}>
            <span>Publish queue</span>
            <strong>
              {health.queue
                ? `${health.queue.delayed} scheduled · ${health.queue.waiting} waiting · ${health.queue.failed} failed`
                : 'unavailable'}
            </strong>
          </li>
        </ul>
      )}

      {health && <p className="meta">Checked {new Date(health.checkedAt).toLocaleTimeString()}, refreshes every 5 seconds.</p>}
    </main>
  );
}
