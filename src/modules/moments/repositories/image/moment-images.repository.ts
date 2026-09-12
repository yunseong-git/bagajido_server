import { Injectable } from '@nestjs/common';
import { StorageProvider } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';

import type {
    CreateMomentImageInput,
    MomentImagesRepository,
    UpdateMomentImageOrderInput,
} from './moment-images.repository.interface';

@Injectable()
export class MomentImagesPrismaRepository implements MomentImagesRepository {
    constructor(private readonly prisma: PrismaService) { }

    findByObjectKeys(objectKeys: string[]) {
        return this.prisma.momentImage.findMany({
            where: {
                objectKey: {
                    in: objectKeys,
                },
            },
        });
    }

    countByMomentId(momentId: string): Promise<number> {
        return this.prisma.momentImage.count({
            where: {
                momentId,
            },
        });
    }

    async findMaxSortOrderByMomentId(momentId: string): Promise<number> {
        const result = await this.prisma.momentImage.aggregate({
            where: {
                momentId,
            },
            _max: {
                sortOrder: true,
            },
        });

        return result._max.sortOrder ?? -1;
    }

    findManyByMomentId(momentId: string) {
        return this.prisma.momentImage.findMany({
            where: {
                momentId,
            },
            orderBy: [
                {
                    sortOrder: 'asc',
                },
                {
                    createdAt: 'asc',
                },
            ],
        });
    }

    findByIdAndMomentId(
        imageId: string,
        momentId: string,
    ) {
        return this.prisma.momentImage.findFirst({
            where: {
                id: imageId,
                momentId,
            },
        });
    }

    updateSortOrders(inputs: UpdateMomentImageOrderInput[]) {
        return this.prisma.$transaction(
            inputs.map((input) =>
                this.prisma.momentImage.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        sortOrder: input.sortOrder,
                    },
                }),
            ),
        );
    }

    deleteById(imageId: string) {
        return this.prisma.momentImage.delete({
            where: {
                id: imageId,
            },
        });
    }

    createMany(inputs: CreateMomentImageInput[]) {
        return this.prisma.$transaction(
            inputs.map((input) =>
                this.prisma.momentImage.create({
                    data: {
                        moment: {
                            connect: {
                                id: input.momentId,
                            },
                        },
                        storageProvider: StorageProvider.R2,
                        objectKey: input.objectKey,
                        sortOrder: input.sortOrder,
                        width: input.width,
                        height: input.height,
                        mimeType: input.mimeType,
                        sizeBytes: input.sizeBytes,
                        takenAt: input.takenAt,
                    },
                }),
            ),
        );
    }
}