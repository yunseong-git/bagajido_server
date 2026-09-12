import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import {
    categoryRatingMetricInclude,
    ratingWithRelationsInclude,
} from './types/rating-with-relations.type';

import type {
    CreateRatingInput,
    RatingsRepository,
    UpdateRatingInput,
} from './ratings.repository.interface';

@Injectable()
export class RatingsPrismaRepository implements RatingsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findByMomentId(momentId: string) {
        return this.prisma.placeRating.findUnique({
            where: {
                momentId,
            },
            include: ratingWithRelationsInclude,
        });
    }

    findCategoryMetricsByCategoryId(categoryId: string) {
        return this.prisma.categoryRatingMetric.findMany({
            where: {
                categoryId,
                metricDefinition: {
                    isActive: true,
                },
            },
            include: categoryRatingMetricInclude,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });
    }

    create(input: CreateRatingInput) {
        return this.prisma.placeRating.create({
            data: {
                overallScore: input.overallScore,

                moment: {
                    connect: {
                        id: input.momentId,
                    },
                },

                metrics: {
                    create: input.metrics.map((metric) => ({
                        metricDefinitionId: metric.metricDefinitionId,
                        score: metric.score,
                    })),
                },
            },
            include: ratingWithRelationsInclude,
        });
    }

    updateByMomentId(momentId: string, input: UpdateRatingInput) {
        const data: Prisma.PlaceRatingUpdateInput = {};

        if (input.overallScore !== undefined) {
            data.overallScore = input.overallScore;
        }

        if (input.metrics !== undefined) {
            data.metrics = {
                deleteMany: {},
                create: input.metrics.map((metric) => ({
                    metricDefinitionId: metric.metricDefinitionId,
                    score: metric.score,
                })),
            };
        }

        return this.prisma.placeRating.update({
            where: {
                momentId,
            },
            data,
            include: ratingWithRelationsInclude,
        });
    }
}