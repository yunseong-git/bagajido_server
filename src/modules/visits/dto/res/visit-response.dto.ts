import {
    PlaceStatus,
    VisitExperienceType,
    VisitVerificationType,
    VisitorType,
} from '@prisma/client';

export class VisitPlaceCategoryResponseDto {
    id!: string;
    key!: string;

    nameKo!: string;
    nameEn!: string | null;
}

export class VisitPlaceResponseDto {
    id!: string;
    name!: string;
    address!: string | null;
    status!: PlaceStatus;

    category!: | VisitPlaceCategoryResponseDto | null;
}

export class VisitResponseDto {
    id!: string;

    place!: VisitPlaceResponseDto;

    visitedOn!: string;
    visitedAt!: Date | null;

    experienceType!: VisitExperienceType;
    visitorType!: VisitorType;

    verificationType!: VisitVerificationType;
    verifiedAt!: Date | null;

    hasRating!: boolean;

    createdAt!: Date;
    updatedAt!: Date;
}

export interface VisitListResponseDto {
    items: VisitResponseDto[];
    total: number;
    page: number;
    limit: number;
}