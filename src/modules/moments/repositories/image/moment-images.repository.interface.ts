import type { MomentImage } from '@prisma/client';

export interface CreateMomentImageInput {
    momentId: string;
    objectKey: string;
    sortOrder: number;
    width?: number;
    height?: number;
    mimeType: string;
    sizeBytes: number;
    takenAt?: Date;
}

export interface UpdateMomentImageOrderInput {
    id: string;
    sortOrder: number;
}

export interface MomentImagesRepository {
    findByObjectKeys(objectKeys: string[]): Promise<MomentImage[]>;
    findManyByMomentId(momentId: string): Promise<MomentImage[]>;
    findByIdAndMomentId(
        imageId: string,
        momentId: string,
    ): Promise<MomentImage | null>;

    countByMomentId(momentId: string): Promise<number>;
    findMaxSortOrderByMomentId(momentId: string): Promise<number>;

    createMany(inputs: CreateMomentImageInput[]): Promise<MomentImage[]>;
    updateSortOrders(
        inputs: UpdateMomentImageOrderInput[],
    ): Promise<MomentImage[]>;

    deleteById(imageId: string): Promise<MomentImage>;
}