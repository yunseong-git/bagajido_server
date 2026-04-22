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

  async create(input: {
    user_id: string;
    order_id: string;
    menu_id: string;
    value_score?: string | number;
    ai_analysis?: Prisma.InputJsonValue;
  }) {
    const created = await this.prisma.review.create({
      data: {
        user_id: input.user_id,
        order_id: input.order_id,
        menu_id: input.menu_id,
        value_score:
          input.value_score === undefined
            ? undefined
            : new Prisma.Decimal(input.value_score),
        ai_analysis: input.ai_analysis,
      },
      select: {
        id: true,
        user_id: true,
        order_id: true,
        menu_id: true,
        value_score: true,
        ai_analysis: true,
        deleted_at: true,
        created_at: true,
        updated_at: true,
      },
    });
    return {
      ...created,
      value_score: created.value_score ? created.value_score.toString() : null,
    };
  }

  async update(
    review_id: string,
    input: { value_score?: string | number; ai_analysis?: Prisma.InputJsonValue },
  ) {
    const data: Prisma.ReviewUpdateInput = {};
    if (input.value_score !== undefined) {
      data.value_score = new Prisma.Decimal(input.value_score);
    }
    if (input.ai_analysis !== undefined) {
      data.ai_analysis = input.ai_analysis;
    }

    const updated = await this.prisma.review.updateMany({
      where: { id: review_id },
      data,
    });
    if (updated.count === 0) {
      return null;
    }
    return this.findById(review_id);
  }

  async findById(review_id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: review_id },
      select: {
        id: true,
        user_id: true,
        order_id: true,
        menu_id: true,
        value_score: true,
        ai_analysis: true,
        deleted_at: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!review) {
      return null;
    }
    return {
      ...review,
      value_score: review.value_score ? review.value_score.toString() : null,
    };
  }

  async findMany(query: {
    user_id?: string;
    order_id?: string;
    menu_id?: string;
    include_deleted?: boolean;
  }) {
    const rows = await this.prisma.review.findMany({
      where: {
        user_id: query.user_id,
        order_id: query.order_id,
        menu_id: query.menu_id,
        deleted_at: query.include_deleted ? undefined : null,
      },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        user_id: true,
        order_id: true,
        menu_id: true,
        value_score: true,
        ai_analysis: true,
        deleted_at: true,
        created_at: true,
        updated_at: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      value_score: row.value_score ? row.value_score.toString() : null,
    }));
  }

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
