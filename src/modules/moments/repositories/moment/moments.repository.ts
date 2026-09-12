import { Injectable } from '@nestjs/common';
import { MomentStatus, MomentVisibility, Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';

import { MomentWithRelations, momentWithRelationsInclude } from '../../types/moment-with-relations.type';
import { publicMomentWithRelationsInclude } from '../../types/public-moment-with-relations.type';

import type {
    CreateMomentInput,
    FindMyMomentsInput,
    MomentListResult,
    MomentsRepository,
    UpdateMomentInput,
} from './moments.repository.interface';


@Injectable()
export class MomentsPrismaRepository implements MomentsRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(input: CreateMomentInput) {
        return this.prisma.moment.create({
            data: {
                userId: input.userId,
                placeId: input.placeId,

                visitedOn: input.visitedOn,
                visitedAt: input.visitedAt,

                experienceType: input.experienceType,
                visitorType: input.visitorType,

                verificationType: input.verificationType,

                content: input.content,
                languageCode: input.languageCode,

                visibility: input.visibility,
            },
            include: momentWithRelationsInclude,
        });
    }

    findByIdAndUserId(momentId: string, userId: string) {
        return this.prisma.moment.findFirst({
            where: {
                id: momentId,
                userId,
                status: MomentStatus.ACTIVE,
            },
            include: momentWithRelationsInclude,
        });
    }

    async findManyByUserId(input: FindMyMomentsInput): Promise<MomentListResult> {
        const where: Prisma.MomentWhereInput = {
            userId: input.userId,
            status: MomentStatus.ACTIVE,
        };

        if (input.placeId !== undefined) {
            where.placeId = input.placeId;
        }

        if (input.from !== undefined || input.to !== undefined) {
            where.visitedOn = {};

            if (input.from !== undefined) {
                where.visitedOn.gte = input.from;
            }

            if (input.to !== undefined) {
                where.visitedOn.lte = input.to;
            }
        }

        const [items, total] = await Promise.all([
            this.prisma.moment.findMany({
                where,
                include: momentWithRelationsInclude,
                orderBy: [
                    { visitedOn: 'desc' },
                    { createdAt: 'desc' },
                ],
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.moment.count({ where }),
        ]);

        return { items, total };
    }

    async findPublicByPlaceId(input: {
        placeId: string;
        skip: number;
        take: number;
    }) {
        const where = {
            placeId: input.placeId,
            visibility: MomentVisibility.PUBLIC,
            status: MomentStatus.ACTIVE,
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.moment.findMany({
                where,
                include: publicMomentWithRelationsInclude,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: input.skip,
                take: input.take,
            }),

            this.prisma.moment.count({
                where,
            }),
        ]);

        return {
            items,
            total,
        };
    }

    updateById(momentId: string, input: UpdateMomentInput) {
        return this.prisma.moment.update({
            where: {
                id: momentId,
            },
            data: input,
            include: momentWithRelationsInclude,
        });
    }

    findPublicById(momentId: string): Promise<MomentWithRelations | null> {
        return this.prisma.moment.findFirst({
            where: {
                id: momentId,
                visibility: MomentVisibility.PUBLIC,
                status: MomentStatus.ACTIVE,
            },
            include: momentWithRelationsInclude,
        });
    }

    softDeleteById(momentId: string) {
        return this.prisma.moment.update({
            where: {
                id: momentId,
            },
            data: {
                status: MomentStatus.DELETED,
                deletedAt: new Date(),
            },
            include: momentWithRelationsInclude,
        });
    }
}