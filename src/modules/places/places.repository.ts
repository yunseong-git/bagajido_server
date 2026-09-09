import { Injectable } from '@nestjs/common';
import { PlaceStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import type {
    CreateCategoryInput,
    CreateExternalSourceInput,
    CreatePlaceInput,
    FindPlacesInput,
    PlacesRepository,
    UpdatePlaceInput,
} from './places.repository.interface';

const placeInclude = {
    category: true,

    externalSources: {
        select: {
            id: true,

            provider: true,
            externalId: true,
            externalType: true,

            sourceUpdatedAt: true,
            syncedAt: true,

            createdAt: true,
            updatedAt: true,
        },
    },
} satisfies Prisma.PlaceInclude;

@Injectable()
export class PlacesPrismaRepository implements PlacesRepository {
    constructor(private readonly prisma: PrismaService) {}

    findCategoryById(id: string) {
        return this.prisma.placeCategory.findUnique({ where: { id } });
    }

    findCategoryByKey(key: string) {
        return this.prisma.placeCategory.findUnique({ where: { key } });
    }

    findCategories() {
        return this.prisma.placeCategory.findMany({
            orderBy: [{ parentId: 'asc' }, { key: 'asc' }],
        });
    }

    createCategory(input: CreateCategoryInput) {
        return this.prisma.placeCategory.create({
            data: {
                key: input.key,

                nameKo: input.nameKo,
                nameEn: input.nameEn,

                parentId: input.parentId,
            },
        });
    }

    findPlaceById(id: string) {
        return this.prisma.place.findUnique({
            where: { id },
            include: placeInclude,
        });
    }

    async findPlaces(input: FindPlacesInput) {
        const where: Prisma.PlaceWhereInput = { status: input.status };

        if (input.categoryId) {
            where.categoryId = input.categoryId;
        }

        if (input.query) {
            where.OR = [
                { name: { contains: input.query, mode: 'insensitive' } },
                { normalizedName: { contains: input.query } },
                { address: { contains: input.query, mode: 'insensitive' } },
            ];
        }

        const skip = (input.page - 1) * input.limit;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.place.findMany({
                where,
                include: placeInclude,
                orderBy: [{ name: 'asc' }, { id: 'asc' }],
                skip,
                take: input.limit,
            }),

            this.prisma.place.count({ where }),
        ]);

        return { items, total };
    }

    async createPlace(input: CreatePlaceInput) {
        return this.prisma.$transaction(async (tx) => {
            const place = await tx.place.create({
                data: {
                    categoryId: input.categoryId,

                    name: input.name,
                    normalizedName: input.normalizedName,

                    address: input.address,
                    normalizedAddress: input.normalizedAddress,

                    postalCode: input.postalCode,

                    latitude: input.latitude,
                    longitude: input.longitude,

                    businessNumber: input.businessNumber,

                    phone: input.phone,
                    websiteUrl: input.websiteUrl,
                    description: input.description,

                    operationInfo: input.operationInfo,
                    priceInfo: input.priceInfo,
                },
            });

            if (input.externalSource) {
                await tx.placeExternalSource.create({
                    data: {
                        placeId: place.id,

                        provider: input.externalSource.provider,
                        externalId: input.externalSource.externalId,
                        externalType: input.externalSource.externalType,

                        sourceUpdatedAt: input.externalSource.sourceUpdatedAt,
                        syncedAt: new Date(),

                        rawData: input.externalSource.rawData,
                    },
                });
            }

            return tx.place.findUniqueOrThrow({
                where: { id: place.id },
                include: placeInclude,
            });
        });
    }

    updatePlace(id: string, input: UpdatePlaceInput) {
        return this.prisma.place.update({
            where: { id },
            data: input,
            include: placeInclude,
        });
    }

    archivePlace(id: string, reason?: string) {
        return this.prisma.place.update({
            where: { id },
            data: {
                status: PlaceStatus.ARCHIVED,
                archivedAt: new Date(),
                archiveReason: reason ?? null,
            },
            include: placeInclude,
        });
    }

    restorePlace(id: string) {
        return this.prisma.place.update({
            where: { id },
            data: {
                status: PlaceStatus.ACTIVE,
                archivedAt: null,
                archiveReason: null,
            },
            include: placeInclude,
        });
    }

    createExternalSource(placeId: string, input: CreateExternalSourceInput) {
        return this.prisma.placeExternalSource.create({
            data: {
                placeId,

                provider: input.provider,
                externalId: input.externalId,
                externalType: input.externalType,

                sourceUpdatedAt: input.sourceUpdatedAt,
                syncedAt: new Date(),

                rawData: input.rawData,
            },
        });
    }
}
