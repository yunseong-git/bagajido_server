import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { CreateRatingDto } from '../dto/req/create-rating.dto';
import { UpdateRatingDto } from '../dto/req/update-rating.dto';
import type { RatingResponseDto } from '../dto/res/rating-response.dto';

import { RatingsCommandService } from '../services/ratings-command.service';
import { RatingsQueryService } from '../services/ratings-query.service';

@ApiTags('Ratings')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller('moments/:momentId/rating')
export class MomentRatingsController {
    constructor(
        private readonly ratingsQueryService: RatingsQueryService,
        private readonly ratingsCommandService: RatingsCommandService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Moment Rating 생성',
    })
    createRating(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: CreateRatingDto,
    ): Promise<RatingResponseDto> {
        return this.ratingsCommandService.createRating(user.id, momentId, dto);
    }

    @Get()
    @ApiOperation({
        summary: '내 Moment Rating 조회',
    })
    getMyRating(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<RatingResponseDto> {
        return this.ratingsQueryService.getMyRating(user.id, momentId);
    }

    @Patch()
    @ApiOperation({
        summary: '내 Moment Rating 수정',
    })
    updateRating(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: UpdateRatingDto,
    ): Promise<RatingResponseDto> {
        return this.ratingsCommandService.updateRating(user.id, momentId, dto);
    }
}