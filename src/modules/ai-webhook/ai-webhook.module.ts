import { Module } from '@nestjs/common';
import { ReviewsModule } from '../reviews/reviews.module';
import { QueueModule } from '../queue/queue.module';
import { AiWebhookController } from './ai-webhook.controller';
import { AiWebhookService } from './ai-webhook.service';

@Module({
  imports: [ReviewsModule, QueueModule],
  controllers: [AiWebhookController],
  providers: [AiWebhookService],
})
export class AiWebhookModule {}
