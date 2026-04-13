import { Module } from '@nestjs/common';
import { REVIEW_UPDATE_ELIGIBILITY_CHECKER } from '../../common/tokens';
import { PrismaReviewUpdateEligibilityChecker } from './prisma-review-update-eligibility.checker';
import { ReviewsController } from './reviews.controller';
import { ReviewsPrismaRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  providers: [
    ReviewsPrismaRepository,
    ReviewsService,
    PrismaReviewUpdateEligibilityChecker,
    {
      provide: REVIEW_UPDATE_ELIGIBILITY_CHECKER,
      useExisting: PrismaReviewUpdateEligibilityChecker,
    },
  ],
  exports: [
    ReviewsPrismaRepository,
    ReviewsService,
    REVIEW_UPDATE_ELIGIBILITY_CHECKER,
  ],
})
export class ReviewsModule {}
