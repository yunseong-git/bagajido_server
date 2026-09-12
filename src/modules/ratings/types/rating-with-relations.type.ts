import { Prisma } from '@prisma/client';

export const ratingWithRelationsInclude = {
    metrics: {
        include: {
            metricDefinition: true,
        },
    },
} satisfies Prisma.PlaceRatingInclude;

export type RatingWithRelations = Prisma.PlaceRatingGetPayload<{
    include: typeof ratingWithRelationsInclude;
}>;

export const categoryRatingMetricInclude = {
    metricDefinition: true,
} satisfies Prisma.CategoryRatingMetricInclude;

export type CategoryRatingMetricWithDefinition = Prisma.CategoryRatingMetricGetPayload<{
    include: typeof categoryRatingMetricInclude;
}>;