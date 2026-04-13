import { NotFoundException } from '@nestjs/common';

export class ReviewNotFoundException extends NotFoundException {
  constructor() {
    super('review_not_found');
  }
}
