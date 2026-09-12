import type { MomentResponseDto } from '../dto/moment/res/moment-response.dto';
import type { PublicMomentResponseDto } from '../dto/moment/res/public-moment-response.dto';

import type { MomentWithRelations } from '../types/moment-with-relations.type';
import type { PublicMomentWithRelations } from '../types/public-moment-with-relations.type';

import { formatDateOnly } from '../utils/moment-date.util';

export function toMomentResponse(
    moment: MomentWithRelations,
): MomentResponseDto {
    return {
        id: moment.id,
        place: {
            id: moment.place.id,
            name: moment.place.name,
            category: moment.place.category
                ? {
                    id: moment.place.category.id,
                    key: moment.place.category.key,
                    nameKo: moment.place.category.nameKo,
                    nameEn: moment.place.category.nameEn,
                }
                : null,
        },
        visitedOn: formatDateOnly(moment.visitedOn),
        visitedAt: moment.visitedAt,
        experienceType: moment.experienceType,
        visitorType: moment.visitorType,
        verificationType: moment.verificationType,
        verifiedAt: moment.verifiedAt,
        content: moment.content,
        languageCode: moment.languageCode,
        visibility: moment.visibility,
        status: moment.status,
        hasRating: moment.rating !== null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
    };
}

export function toPublicMomentResponse(
    moment: PublicMomentWithRelations,
    getImageUrl: (objectKey: string) => string,
    likedByMe = false,
): PublicMomentResponseDto {
    return {
        id: moment.id,
        placeId: moment.placeId,
        user: {
            id: moment.user.id,
            username: moment.user.username,
            displayName: moment.user.displayName,
            profileImageKey: moment.user.profileImageKey,
        },
        visitedOn: formatDateOnly(moment.visitedOn),
        experienceType: moment.experienceType,
        visitorType: moment.visitorType,
        verificationType: moment.verificationType,
        content: moment.content,
        languageCode: moment.languageCode,
        hasRating: moment.rating !== null,
        rating: moment.rating
            ? {
                overallScore: moment.rating.overallScore,
                metrics: moment.rating.metrics.map((metric) => ({
                    metricDefinitionId: metric.metricDefinitionId,
                    key: metric.metricDefinition.key,
                    labelKo: metric.metricDefinition.labelKo,
                    labelEn: metric.metricDefinition.labelEn,
                    direction: metric.metricDefinition.direction,
                    score: metric.score,
                })),
            }
            : null,
        images: moment.images.map((image) => ({
            id: image.id,
            imageUrl: getImageUrl(image.objectKey),
            sortOrder: image.sortOrder,
            width: image.width,
            height: image.height,
        })),
        likeCount: moment._count.likes,
        likedByMe,
        commentCount: moment._count.comments,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
    };
}