# Cadence

A team workspace for composing social posts, scheduling them, and publishing them through background jobs that retry when a platform fails.

**Stack:** Next.js · NestJS · MongoDB · Redis + BullMQ · TypeScript

## Project structure

```
apps/
  api/            NestJS: REST API (src/main.ts) and publish worker (src/worker.main.ts)
    src/health/   GET /api/health checks MongoDB, Redis, and the queue
    src/queue/    Redis connection + the "publish" BullMQ queue
    src/worker/   Job processor, runs only in the worker process
  web/            Next.js dashboard
docker-compose.yml  MongoDB + Redis for local development
```

The API and the worker are two processes built from one codebase, so they share models and config but scale and restart independently.

## Run locally

Needs Node 20+ and Docker.

```bash
npm install
cp .env.example apps/api/.env
npm run db:up        # starts MongoDB and Redis
```

Then in three terminals:

```bash
npm run dev:api      # http://localhost:3001/api/health
npm run dev:worker   # publish worker
npm run dev:web      # http://localhost:3000
```

The home page shows whether MongoDB, Redis, and the publish queue are reachable.

**Tests:** `npm test`

## Roadmap

- [x] 1. Foundation: monorepo, Docker, API, worker process, web app
- [ ] 2. Auth: signup, login, JWT, refresh token rotation
- [ ] 3. Workspaces and Owner/Editor/Viewer roles
- [ ] 4. Mock social accounts and post editing
- [ ] 5. Scheduling, publish worker, retries, audit log
- [ ] 6. Live dashboard with WebSocket status updates
- [ ] 7. Media uploads and rate limiting
- [ ] 8. Tests, docs, deploy
