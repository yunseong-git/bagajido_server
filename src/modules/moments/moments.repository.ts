import { Injectable } from '@nestjs/common';
import { MomentStatus, MomentVisibility, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import {
    momentWithRelationsInclude,
    publicMomentInclude,
} from './types/moment-with-relations.type';

import type {
    CreateMomentInput,
    FindMyMomentsInput,
    FindPublicPlaceMomentsInput,
    MomentListResult,
    MomentsRepository,
    PublicMomentListResult,
    UpdateMomentInput,
} from './moments.repository.interface';

@Injectable()
export class MomentsPrismaRepository implements MomentsRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    async findPublicByPlaceId(
        input: FindPublicPlaceMomentsInput,
    ): Promise<PublicMomentListResult> {
        const where: Prisma.MomentWhereInput = {
            placeId: input.placeId,
            status: MomentStatus.ACTIVE,
            visibility: MomentVisibility.PUBLIC,
        };

        const [items, total] = await Promise.all([
            this.prisma.moment.findMany({
                where,
                include: publicMomentInclude,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.moment.count({ where }),
        ]);

        return { items, total };
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