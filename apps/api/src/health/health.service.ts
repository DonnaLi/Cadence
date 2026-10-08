import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Connection } from 'mongoose';
import { PUBLISH_QUEUE } from '../config';

export type DependencyStatus = 'up' | 'down';

export interface HealthReport {
  status: 'ok' | 'degraded';
  mongo: DependencyStatus;
  redis: DependencyStatus;
  queue: { waiting: number; delayed: number; failed: number } | null;
  checkedAt: string;
}

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly mongo: Connection,
    @InjectQueue(PUBLISH_QUEUE) private readonly queue: Queue,
  ) {}

  async check(): Promise<HealthReport> {
    const [mongo, redis] = await Promise.all([this.pingMongo(), this.pingRedis()]);
    const queue =
      redis === 'up'
        ? await this.queue.getJobCounts('waiting', 'delayed', 'failed').then((c) => ({
            waiting: c.waiting ?? 0,
            delayed: c.delayed ?? 0,
            failed: c.failed ?? 0,
          }))
        : null;
    return {
      status: mongo === 'up' && redis === 'up' ? 'ok' : 'degraded',
      mongo,
      redis,
      queue,
      checkedAt: new Date().toISOString(),
    };
  }

  private async pingMongo(): Promise<DependencyStatus> {
    try {
      await this.mongo.db?.admin().ping();
      return this.mongo.readyState === 1 ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }

  private async pingRedis(): Promise<DependencyStatus> {
    try {
      // BullMQ's client is an ioredis connection; its type omits ping().
      const client = (await this.queue.client) as unknown as { ping(): Promise<string> };
      return (await client.ping()) === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
