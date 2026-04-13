import { Injectable } from '@nestjs/common';
import { ReviewsPrismaRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsPrismaRepository) {}
}
