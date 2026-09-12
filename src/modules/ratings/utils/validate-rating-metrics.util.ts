import { BadRequestException } from '@nestjs/common';

import type { RatingMetricInputDto } from '../dto/req/rating-metric-input.dto';
import type { CategoryRatingMetricWithDefinition } from '../types/rating-with-relations.type';

/**평가 매트릭스 유효성 검증, 중복 제외, 누락 제외, 필수 제외 */
export function validateRatingMetrics(
    availableMetrics: CategoryRatingMetricWithDefinition[],
    submittedMetrics: RatingMetricInputDto[],
): void {
    const submittedIds = submittedMetrics.map((metric) => metric.metricDefinitionId);
    const uniqueSubmittedIds = new Set(submittedIds);

    if (uniqueSubmittedIds.size !== submittedIds.length) {
        throw new BadRequestException('DUPLICATE_RATING_METRIC');
    }

    const availableMetricIds = new Set(
        availableMetrics.map((metric) => metric.metricDefinitionId),
    );

    const hasInvalidMetric = submittedMetrics.some(
        (metric) => !availableMetricIds.has(metric.metricDefinitionId),
    );

    if (hasInvalidMetric) {
        throw new BadRequestException('INVALID_RATING_METRIC');
    }

    const submittedMetricIds = new Set(submittedIds);

    const hasMissingRequiredMetric = availableMetrics.some(
        (metric) => metric.isRequired && !submittedMetricIds.has(metric.metricDefinitionId),
    );

    if (hasMissingRequiredMetric) {
        throw new BadRequestException('REQUIRED_RATING_METRIC_MISSING');
    }
}