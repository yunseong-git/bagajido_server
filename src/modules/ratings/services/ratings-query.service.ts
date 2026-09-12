import { Injectable, NotFoundException } from '@nestjs/common';

import { MomentsQueryService } from '../../moments/services/moments-query.service';
import { PlacesQueryService } from '../../places/services/places-query.service';

import type { PlaceRatingMetricsResponseDto } from '../dto/res/place-rating-metrics-response.dto';
import type { RatingResponseDto } from '../dto/res/rating-response.dto';

import {
    toPlaceRatingMetricsResponse,
    toRatingResponse,
} from '../mappers/rating-response.mapper';

import { RatingsPrismaRepository } from '../ratings.repository';

@Injectable()
export class RatingsQueryService {
    constructor(
        private readonly ratingsRepository: RatingsPrismaRepository,
        private readonly momentsQueryService: MomentsQueryService,
        private readonly placesQueryService: PlacesQueryService,
    ) {}

    async getMyRating(userId: string, momentId: string): Promise<RatingResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const rating = await this.ratingsRepository.findByMomentId(momentId);

        if (!rating) throw new NotFoundException('RATING_NOT_FOUND');

        return toRatingResponse(rating);
    }

    async getPlaceRatingMetrics(placeId: string): Promise<PlaceRatingMetricsResponseDto> {
        const place = await this.placesQueryService.getPlace(placeId);
        const categoryId = place.category?.id ?? null;

        if (!categoryId) {
            return toPlaceRatingMetricsResponse(placeId, null, []);
        }

        const metrics = await this.ratingsRepository.findCategoryMetricsByCategoryId(categoryId);

        return toPlaceRatingMetricsResponse(placeId, categoryId, metrics);
    }
}