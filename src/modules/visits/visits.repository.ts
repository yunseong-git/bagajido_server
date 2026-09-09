import { Injectable } from '@nestjs/common';

import { Prisma, } from '@prisma/client';

import { PrismaService, } from '../../prisma/prisma.service';

import { visitInclude, } from './types/visit-with-relations.type';

import type {
    CreateVisitInput,
    FindMyVisitsInput,
    UpdateVisitInput,
    VisitsRepository,
} from './visits.repository.interface';

@Injectable()
export class VisitsPrismaRepository
    implements VisitsRepository {
    constructor(private readonly prisma: PrismaService,) { }

    create(input: CreateVisitInput,) {
        return this.prisma.placeVisit.create({
            data: {
                userId: input.userId,
                placeId: input.placeId,

                visitedOn: input.visitedOn,
                visitedAt: input.visitedAt,

                experienceType: input.experienceType,
                visitorType: input.visitorType,
                verificationType: input.verificationType,
            },
            include: visitInclude,
        });
    }

    findByIdAndUserId(visitId: string, userId: string,) {
        return this.prisma.placeVisit.findFirst({
            where: {
                id: visitId,
                userId,
            },

            include: visitInclude,
        });
    }

    async findManyByUserId(input: FindMyVisitsInput) {
        const where:
            Prisma.PlaceVisitWhereInput = {
            userId: input.userId,
        };

        if (input.placeId) {
            where.placeId = input.placeId;
        }

        if (input.from || input.to) {
            where.visitedOn = {};

            if (input.from) {
                where.visitedOn.gte = input.from;
            }

            if (input.to) {
                where.visitedOn.lte = input.to;
            }
        }

        const skip = (input.page - 1) * input.limit;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.placeVisit.findMany({
                where,
                include: visitInclude,

                orderBy: [
                    { visitedOn: 'desc', },
                    { createdAt: 'desc', },
                ],

                skip,
                take: input.limit,
            }),

            this.prisma.placeVisit.count({ where, }),
        ]);

        return { items, total };
    }

    updateById(visitId: string, input: UpdateVisitInput,) {
        return this.prisma.placeVisit.update({
            where: {
                id: visitId,
            },
            data: input,
            
            include: visitInclude,
        });
    }
}