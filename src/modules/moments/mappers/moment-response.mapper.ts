import type {
    MomentWithRelations,
    PublicMomentWithRelations,
} from '../types/moment-with-relations.type';

import type { MomentResponseDto } from '../dto/res/moment-response.dto';
import type { PublicMomentResponseDto } from '../dto/res/public-moment-response.dto';

import { formatDateOnly } from '../utils/moment-date.util';

export function toMomentResponse(moment: MomentWithRelations): MomentResponseDto {
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
): PublicMomentResponseDto {
    return {
        id: moment.id,

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

        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
    };
}