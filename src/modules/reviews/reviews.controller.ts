import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  @Get()
  @ApiOperation({ summary: '리뷰 목록 (Phase 1 스텁)' })
  listStub() {
    return { items: [] };
  }
}
