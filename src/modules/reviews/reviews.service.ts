import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReviewsPrismaRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewQueryDto } from './dto/find-review-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewSoftDeletedException } from './exceptions/review-soft-deleted.exception';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsPrismaRepository) {}

  create(user_id: string, input: CreateReviewDto) {
    return this.reviewsRepository.create({
      user_id,
      order_id: input.order_id,
      menu_id: input.menu_id,
      value_score: input.value_score,
      ai_analysis: input.ai_analysis as Prisma.InputJsonValue | undefined,
    });
  }

  async update(review_id: string, input: UpdateReviewDto) {
    const existing = await this.reviewsRepository.findById(review_id);
    if (!existing) {
      throw new NotFoundException('review_not_found');
    }
    if (existing.deleted_at) {
      throw new ReviewSoftDeletedException();
    }
    const updated = await this.reviewsRepository.update(review_id, {
      value_score: input.value_score,
      ai_analysis: input.ai_analysis as Prisma.InputJsonValue | undefined,
    });
    if (!updated) {
      throw new NotFoundException('review_not_found');
    }
    return updated;
  }

  async findOne(review_id: string) {
    const review = await this.reviewsRepository.findById(review_id);
    if (!review) {
      throw new NotFoundException('review_not_found');
    }
    return review;
  }

  findMany(query: FindReviewQueryDto) {
    return this.reviewsRepository.findMany(query);
  }
}
