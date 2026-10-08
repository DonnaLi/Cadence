import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUri } from '../config';
import { QueueModule } from '../queue/queue.module';
import { PublishProcessor } from './publish.processor';

/** Everything the worker process needs: no HTTP controllers. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: mongoUri(config) }),
    }),
    QueueModule,
  ],
  providers: [PublishProcessor],
})
export class WorkerModule {}
