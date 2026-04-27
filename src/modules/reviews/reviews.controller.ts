import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '../auth/types/user-role.type';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewQueryDto } from './dto/find-review-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { ReviewResponseDto } from './dto/res/reviews-response.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: '리뷰 생성' })
  @ApiCreatedResponse({ type: ReviewResponseDto })
  create(@Req() req: Request & { userEntity: { id: string } }, @Body() body: CreateReviewDto) {
    return this.reviewsService.create(req.userEntity.id, body);
  }

  @Patch(':reviewId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({ summary: '리뷰 수정' })
  @ApiOkResponse({ type: ReviewResponseDto })
  update(@Param('reviewId') reviewId: string, @Body() body: UpdateReviewDto) {
    return this.reviewsService.update(reviewId, body);
  }

  @Get(':reviewId')
  @ApiOperation({ summary: '리뷰 단건 조회' })
  @ApiOkResponse({ type: ReviewResponseDto })
  findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  @Get()
  @ApiOperation({ summary: '리뷰 목록 조회' })
  @ApiOkResponse({ type: [ReviewResponseDto] })
  list(@Query() query: FindReviewQueryDto) {
    return this.reviewsService.findMany(query);
  }
}
