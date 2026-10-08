import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUri } from './config';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: mongoUri(config),
        serverSelectionTimeoutMS: 2000,
      }),
    }),
    QueueModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
