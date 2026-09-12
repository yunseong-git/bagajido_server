import type {
    CategoryRatingMetricWithDefinition,
    RatingWithRelations,
} from './types/rating-with-relations.type';

export interface RatingMetricInput {
    metricDefinitionId: string;
    score: number;
}

export interface CreateRatingInput {
    momentId: string;
    overallScore: number;
    metrics: RatingMetricInput[];
}

export interface UpdateRatingInput {
    overallScore?: number;
    metrics?: RatingMetricInput[];
}

export interface RatingsRepository {
    findByMomentId(momentId: string): Promise<RatingWithRelations | null>;

    findCategoryMetricsByCategoryId(
        categoryId: string,
    ): Promise<CategoryRatingMetricWithDefinition[]>;

    create(input: CreateRatingInput): Promise<RatingWithRelations>;

    updateByMomentId(
        momentId: string,
        input: UpdateRatingInput,
    ): Promise<RatingWithRelations>;
}