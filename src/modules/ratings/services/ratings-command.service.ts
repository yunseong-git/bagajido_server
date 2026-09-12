import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { MomentsQueryService } from '../../moments/services/moments-query.service';

import type { CreateRatingDto } from '../dto/req/create-rating.dto';
import type { UpdateRatingDto } from '../dto/req/update-rating.dto';
import type { RatingResponseDto } from '../dto/res/rating-response.dto';

import { toRatingResponse } from '../mappers/rating-response.mapper';

import { RatingsPrismaRepository } from '../ratings.repository';

import { validateRatingMetrics } from '../utils/validate-rating-metrics.util';

@Injectable()
export class RatingsCommandService {
    constructor(
        private readonly ratingsRepository: RatingsPrismaRepository,
        private readonly momentsQueryService: MomentsQueryService,
    ) { }

    async createRating(
        userId: string,
        momentId: string,
        dto: CreateRatingDto,
    ): Promise<RatingResponseDto> {
        const moment = await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const existingRating = await this.ratingsRepository.findByMomentId(momentId);

        if (existingRating) throw new ConflictException('RATING_ALREADY_EXISTS');

        const availableMetrics = moment.place.category
            ? await this.ratingsRepository.findCategoryMetricsByCategoryId(moment.place.category.id)
            : [];

        const submittedMetrics = dto.metrics ?? [];

        validateRatingMetrics(availableMetrics, submittedMetrics);

        try {
            const rating = await this.ratingsRepository.create({
                momentId,
                overallScore: dto.overallScore,
                metrics: submittedMetrics,
            });

            return toRatingResponse(rating);
        } catch (error) {
            const isUniqueError =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

            if (isUniqueError) throw new ConflictException('RATING_ALREADY_EXISTS');

            throw error;
        }
    }

    async updateRating(
        userId: string,
        momentId: string,
        dto: UpdateRatingDto,
    ): Promise<RatingResponseDto> {
        const moment = await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const existingRating = await this.ratingsRepository.findByMomentId(momentId);

        if (!existingRating) throw new NotFoundException('RATING_NOT_FOUND');

        if (dto.overallScore === undefined && dto.metrics === undefined) {
            throw new BadRequestException('NO_RATING_CHANGES');
        }

        if (dto.metrics !== undefined) {
            const availableMetrics = moment.place.category
                ? await this.ratingsRepository.findCategoryMetricsByCategoryId(
                    moment.place.category.id,
                )
                : [];

            validateRatingMetrics(availableMetrics, dto.metrics);
        }

        const rating = await this.ratingsRepository.updateByMomentId(momentId, {
            overallScore: dto.overallScore,
            metrics: dto.metrics,
        });

        return toRatingResponse(rating);
    }
}