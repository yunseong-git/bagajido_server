import type { Prisma } from '@prisma/client';

export interface ApplyAiWebhookResultInput {
  review_id: string;
  external_job_id: string;
  callback_status: string;
  payload: Prisma.InputJsonValue;
  value_score?: string | number;
  ai_analysis?: Prisma.InputJsonValue;
}

export interface ReviewsRepository {
  applyAiWebhookResult(input: ApplyAiWebhookResultInput): Promise<void>;
  findStoreIdForReview(review_id: string): Promise<string | null>;
}
