import { Module } from '@nestjs/common';
import { ReviewsModule } from '../reviews/reviews.module';
import { AiWebhookController } from './ai-webhook.controller';
import { AiWebhookService } from './ai-webhook.service';

@Module({
  imports: [ReviewsModule],
  controllers: [AiWebhookController],
  providers: [AiWebhookService],
})
export class AiWebhookModule {}
