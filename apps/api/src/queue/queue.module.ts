import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PUBLISH_QUEUE, redisConnection } from '../config';

/**
 * Connects to Redis and registers the publish queue.
 * Imported by both the API (to add jobs) and the worker (to process them).
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ connection: redisConnection(config) }),
    }),
    BullModule.registerQueue({ name: PUBLISH_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
