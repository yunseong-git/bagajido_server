import {
    VisitExperienceType,
    VisitVerificationType,
    VisitorType,
} from '@prisma/client';

import type { VisitWithRelations, } from './types/visit-with-relations.type';

export interface CreateVisitInput {
    userId: string;
    placeId: string;

    visitedOn: Date;
    visitedAt?: Date | null;

    experienceType:
    VisitExperienceType;

    visitorType:
    VisitorType;

    verificationType:
    VisitVerificationType;
}

export interface UpdateVisitInput {
    visitedOn?: Date;

    visitedAt?: Date | null;

    experienceType?:
    VisitExperienceType;

    visitorType?:
    VisitorType;
}

export interface FindMyVisitsInput {
    userId: string;

    placeId?: string;

    from?: Date;
    to?: Date;

    page: number;
    limit: number;
}

export interface VisitsRepository {
    create(input: CreateVisitInput,): Promise<VisitWithRelations>;

    findByIdAndUserId(visitId: string, userId: string,): Promise<VisitWithRelations | null>;

    findManyByUserId(input: FindMyVisitsInput,)
        : Promise<{
            items: VisitWithRelations[];
            total: number;
        }>;

    updateById(visitId: string, input: UpdateVisitInput,): Promise<VisitWithRelations>;
}