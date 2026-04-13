import { Injectable } from '@nestjs/common';
import { ReviewUpdateEligibilityChecker } from '../../common/interfaces/review-update-eligibility.checker';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewNotFoundException } from './exceptions/review-not-found.exception';
import { ReviewSoftDeletedException } from './exceptions/review-soft-deleted.exception';

@Injectable()
export class PrismaReviewUpdateEligibilityChecker
  implements ReviewUpdateEligibilityChecker
{
  constructor(private readonly prisma: PrismaService) {}

  async assertCanApplyAiResult(review_id: string): Promise<void> {
    const row = await this.prisma.review.findUnique({
      where: { id: review_id },
      select: { id: true, deleted_at: true },
    });
    if (!row) {
      throw new ReviewNotFoundException();
    }
    if (row.deleted_at !== null) {
      throw new ReviewSoftDeletedException();
    }
  }
}
