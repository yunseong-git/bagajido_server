import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AI_POSTPROCESS_QUEUE } from './queue.constants';

export type AiPostprocessJobData = {
  store_id: string;
  review_id: string;
};

@Processor(AI_POSTPROCESS_QUEUE)
export class AiPostprocessProcessor extends WorkerHost {
  private readonly logger = new Logger(AiPostprocessProcessor.name);

  async process(job: Job<AiPostprocessJobData>) {
    this.logger.log(
      `ai-postprocess job ${job.id} store_id=${job.data.store_id} review_id=${job.data.review_id}`,
    );
  }
}
