import { VisitResponseDto, } from '../dto/res/visit-response.dto';

import type { VisitWithRelations, } from '../types/visit-with-relations.type';

import { formatDateOnly, } from '../utils/visit-date.util';

export function toVisitResponse(
    visit: VisitWithRelations,
): VisitResponseDto {
    return {
        id: visit.id,
        place: {
            id: visit.place.id,
            name: visit.place.name,
            address: visit.place.address,
            status: visit.place.status,
            category: visit.place.category
                ? {
                    id: visit.place.category.id,
                    key: visit.place.category.key,
                    nameKo: visit.place.category.nameKo,
                    nameEn: visit.place.category.nameEn,
                }
                : null,
        },
        visitedOn: formatDateOnly(visit.visitedOn,),
        visitedAt: visit.visitedAt,
        experienceType: visit.experienceType,
        visitorType: visit.visitorType,
        verificationType: visit.verificationType,
        verifiedAt: visit.verifiedAt,
        hasRating: visit.rating !== null,
        createdAt: visit.createdAt,
        updatedAt: visit.updatedAt,
    };
}