import {
    MomentExperienceType,
    MomentVerificationType,
    MomentVisibility,
    VisitorType,
} from '@prisma/client';

import type { MomentWithRelations } from '../../types/moment-with-relations.type';
import type { PublicMomentWithRelations } from '../../types/public-moment-with-relations.type';

export interface CreateMomentInput {
    userId: string;
    placeId: string;

    visitedOn: Date;
    visitedAt?: Date | null;

    experienceType: MomentExperienceType;
    visitorType: VisitorType;

    verificationType: MomentVerificationType;

    content?: string | null;
    languageCode?: string | null;

    visibility: MomentVisibility;
}


export interface UpdateMomentInput {
    visitedOn?: Date;
    visitedAt?: Date | null;

    experienceType?: MomentExperienceType;
    visitorType?: VisitorType;

    content?: string | null;
    languageCode?: string | null;

    visibility?: MomentVisibility;
}

export interface FindMyMomentsInput {
    userId: string;

    placeId?: string;

    from?: Date;
    to?: Date;

    skip: number;
    take: number;
}

export interface FindPublicPlaceMomentsInput {
    placeId: string;

    skip: number;
    take: number;
}


export interface MomentListResult {
    items: MomentWithRelations[];
    total: number;
}

export interface PublicMomentListResult {
    items: PublicMomentWithRelations[];
    total: number;
}

export interface MomentsRepository {
    create(input: CreateMomentInput): Promise<MomentWithRelations>;

    findByIdAndUserId(
        momentId: string,
        userId: string,
    ): Promise<MomentWithRelations | null>;

    findManyByUserId(input: FindMyMomentsInput): Promise<MomentListResult>;

    findPublicByPlaceId(
        input: FindPublicPlaceMomentsInput,
    ): Promise<PublicMomentListResult>;

    updateById(
        momentId: string,
        input: UpdateMomentInput,
    ): Promise<MomentWithRelations>;

    softDeleteById(momentId: string): Promise<MomentWithRelations>;

    findPublicById(momentId: string): Promise<MomentWithRelations | null>;

    findPublicByPlaceId(input: {
        placeId: string;
        skip: number;
        take: number;
    }): Promise<PublicMomentListResult>;
}