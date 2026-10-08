import { ConfigService } from '@nestjs/config';

/** Shared connection settings for the API and the worker. */
export const mongoUri = (config: ConfigService) =>
  config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/cadence');

export const redisConnection = (config: ConfigService) => ({
  host: config.get<string>('REDIS_HOST', 'localhost'),
  port: Number(config.get<string>('REDIS_PORT', '6379')),
});

export const PUBLISH_QUEUE = 'publish';
