import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiPostprocessProcessor } from './ai-postprocess.processor';
import { AI_POSTPROCESS_QUEUE } from './queue.constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URL', 'redis://127.0.0.1:6379'),
        },
      }),
    }),
    BullModule.registerQueue({ name: AI_POSTPROCESS_QUEUE }),
  ],
  providers: [AiPostprocessProcessor],
  exports: [BullModule],
})
export class QueueModule {}
