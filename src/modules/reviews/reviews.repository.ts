import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  ApplyAiWebhookResultInput,
  ReviewsRepository,
} from './reviews.repository.interface';

@Injectable()
export class ReviewsPrismaRepository implements ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findStoreIdForReview(review_id: string): Promise<string | null> {
    const row = await this.prisma.review.findUnique({
      where: { id: review_id },
      select: { menu: { select: { store_id: true } } },
    });
    return row?.menu.store_id ?? null;
  }

  async applyAiWebhookResult(input: ApplyAiWebhookResultInput): Promise<void> {
    const data: Prisma.ReviewUpdateInput = {};
    if (input.value_score !== undefined) {
      data.value_score = new Prisma.Decimal(input.value_score);
    }
    if (input.ai_analysis !== undefined) {
      data.ai_analysis = input.ai_analysis;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.aiAnalysisCallback.create({
        data: {
          external_job_id: input.external_job_id,
          review_id: input.review_id,
          status: input.callback_status,
          payload: input.payload,
        },
      });
      if (Object.keys(data).length > 0) {
        await tx.review.update({
          where: { id: input.review_id },
          data,
        });
      }
    });
  }
}
