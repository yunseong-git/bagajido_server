import type { CategoryRatingMetricWithDefinition, RatingWithRelations } from '../types/rating-with-relations.type';

import type { PlaceRatingMetricOptionDto, PlaceRatingMetricsResponseDto } from '../dto/res/place-rating-metrics-response.dto';
import type { RatingMetricResponseDto, RatingResponseDto } from '../dto/res/rating-response.dto';

//CategoryRatingMetric의 ID 가 아니라 RatingMetricDefinition.id를 보내야하기 때문.
export function toRatingResponse(rating: RatingWithRelations): RatingResponseDto {
    return {
        id: rating.id,
        momentId: rating.momentId,
        overallScore: rating.overallScore,

        metrics: rating.metrics.map((metric): RatingMetricResponseDto => ({
            metricDefinitionId: metric.metricDefinitionId,
            key: metric.metricDefinition.key,
            labelKo: metric.metricDefinition.labelKo,
            labelEn: metric.metricDefinition.labelEn,
            direction: metric.metricDefinition.direction,
            score: metric.score,
        })),

        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
    };
}

export function toPlaceRatingMetricsResponse(
    placeId: string,
    categoryId: string | null,
    metrics: CategoryRatingMetricWithDefinition[],
): PlaceRatingMetricsResponseDto {
    return {
        placeId,
        categoryId,

        metrics: metrics.map((metric): PlaceRatingMetricOptionDto => ({
            id: metric.metricDefinition.id,
            key: metric.metricDefinition.key,
            labelKo: metric.metricDefinition.labelKo,
            labelEn: metric.metricDefinition.labelEn,
            description: metric.metricDefinition.description,
            direction: metric.metricDefinition.direction,
            isRequired: metric.isRequired,
            sortOrder: metric.sortOrder,
        })),
    };
}