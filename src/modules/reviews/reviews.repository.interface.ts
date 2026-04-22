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
  create(input: {
    user_id: string;
    order_id: string;
    menu_id: string;
    value_score?: string | number;
    ai_analysis?: Prisma.InputJsonValue;
  }): Promise<{
    id: string;
    user_id: string;
    order_id: string;
    menu_id: string;
    value_score: string | null;
    ai_analysis: Prisma.JsonValue | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
  }>;
  update(
    review_id: string,
    input: { value_score?: string | number; ai_analysis?: Prisma.InputJsonValue },
  ): Promise<{
    id: string;
    user_id: string;
    order_id: string;
    menu_id: string;
    value_score: string | null;
    ai_analysis: Prisma.JsonValue | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
  } | null>;
  findById(review_id: string): Promise<{
    id: string;
    user_id: string;
    order_id: string;
    menu_id: string;
    value_score: string | null;
    ai_analysis: Prisma.JsonValue | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
  } | null>;
  findMany(query: {
    user_id?: string;
    order_id?: string;
    menu_id?: string;
    include_deleted?: boolean;
  }): Promise<
    {
      id: string;
      user_id: string;
      order_id: string;
      menu_id: string;
      value_score: string | null;
      ai_analysis: Prisma.JsonValue | null;
      deleted_at: Date | null;
      created_at: Date;
      updated_at: Date;
    }[]
  >;
}
