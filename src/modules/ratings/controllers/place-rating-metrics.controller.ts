import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import type { PlaceRatingMetricsResponseDto } from '../dto/res/place-rating-metrics-response.dto';

import { RatingsQueryService } from '../services/ratings-query.service';

@ApiTags('Ratings')
@Controller('places/:placeId/rating-metrics')
export class PlaceRatingMetricsController {
    constructor(private readonly ratingsQueryService: RatingsQueryService) {}

    @Get()
    @ApiOperation({
        summary: 'Place 평가 Metric 목록 조회',
    })
    getPlaceRatingMetrics(
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
    ): Promise<PlaceRatingMetricsResponseDto> {
        return this.ratingsQueryService.getPlaceRatingMetrics(placeId);
    }
}