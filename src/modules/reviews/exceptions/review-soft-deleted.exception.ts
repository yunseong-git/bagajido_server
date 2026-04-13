import { GoneException } from '@nestjs/common';

export class ReviewSoftDeletedException extends GoneException {
  constructor() {
    super('review_soft_deleted');
  }
}
