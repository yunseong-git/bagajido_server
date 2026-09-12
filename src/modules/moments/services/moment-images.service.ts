import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { R2StorageService } from '../../storage/r2/r2-storage.service';
import { MomentsQueryService } from './moments-query.service';

import { MomentImagesPrismaRepository } from '../repositories/image/moment-images.repository';

import type { CreateMomentImageUploadUrlDto } from '../dto/image/req/create-moment-image-upload-url.dto';
import type { MomentImageUploadUrlResponseDto } from '../dto/image/res/moment-image-upload-url-response.dto';
import type { UpdateMomentImageOrderDto } from '../dto/image/req/update-moment-image-order.dto';
import { CreateMomentImageUploadUrlsDto } from '../dto/image/req/create-moment-image-upload-urls.dto';
import { MomentImageUploadUrlsResponseDto } from '../dto/image/res/moment-image-upload-urls-response.dto';
import { CompleteMomentImagesDto } from '../dto/image/req/complete-moment-images.dto';
import { MomentImageListResponseDto } from '../dto/image/res/moment-image-list-response.dto';

import { createMomentImageObjectKey } from '../utils/moment-image-key.util';

import { toMomentImageResponse } from '../mappers/moment-image-response.mapper';

const MAX_MOMENT_IMAGES = 10;
const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;

const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
]);

@Injectable()
export class MomentImagesService {
    private readonly logger = new Logger(MomentImagesService.name);
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly r2StorageService: R2StorageService,
        private readonly momentImagesRepository: MomentImagesPrismaRepository,
    ) { }

    async getMyImages(
        userId: string,
        momentId: string,
    ): Promise<MomentImageListResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const images = await this.momentImagesRepository.findManyByMomentId(momentId);

        return {
            items: images.map((image) =>
                toMomentImageResponse(
                    image,
                    this.r2StorageService.getPublicUrl(image.objectKey),
                ),
            ),
        };
    }

    async createUploadUrl(
        userId: string,
        momentId: string,
        dto: CreateMomentImageUploadUrlDto,
    ): Promise<MomentImageUploadUrlResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const currentImageCount = await this.momentImagesRepository.countByMomentId(momentId);

        if (currentImageCount >= MAX_MOMENT_IMAGES) {
            throw new BadRequestException('MOMENT_IMAGE_LIMIT_EXCEEDED');
        }

        const objectKey = createMomentImageObjectKey(
            userId,
            momentId,
            dto.contentType,
        );

        const expiresIn = 300;

        const uploadUrl = await this.r2StorageService.createUploadUrl(
            objectKey,
            dto.contentType,
            expiresIn,
        );

        return {
            objectKey,
            uploadUrl,
            expiresIn,
        };
    }

    async createUploadUrls(
        userId: string,
        momentId: string,
        dto: CreateMomentImageUploadUrlsDto,
    ): Promise<MomentImageUploadUrlsResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const currentImageCount = await this.momentImagesRepository.countByMomentId(momentId);

        if (currentImageCount + dto.files.length > MAX_MOMENT_IMAGES) {
            throw new BadRequestException('MOMENT_IMAGE_LIMIT_EXCEEDED');
        }

        const expiresIn = 300;

        const items = await Promise.all(
            dto.files.map(async (file) => {
                const objectKey = createMomentImageObjectKey(
                    userId,
                    momentId,
                    file.contentType,
                );

                const uploadUrl = await this.r2StorageService.createUploadUrl(
                    objectKey,
                    file.contentType,
                    expiresIn,
                );

                return { objectKey, uploadUrl };
            }),
        );

        return { items, expiresIn };
    }

    async completeImages(
        userId: string,
        momentId: string,
        dto: CompleteMomentImagesDto,
    ): Promise<MomentImageListResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const objectKeys = dto.images.map((image) => image.objectKey);
        const uniqueObjectKeys = new Set(objectKeys);

        if (uniqueObjectKeys.size !== objectKeys.length) {
            throw new BadRequestException('DUPLICATE_MOMENT_IMAGE_KEY');
        }

        const expectedPrefix = `moments/${userId}/${momentId}/`;

        const hasInvalidObjectKey = objectKeys.some(
            (objectKey) => !objectKey.startsWith(expectedPrefix),
        );

        if (hasInvalidObjectKey) {
            throw new BadRequestException('INVALID_MOMENT_IMAGE_KEY');
        }

        const currentImageCount =
            await this.momentImagesRepository.countByMomentId(momentId);

        if (currentImageCount + dto.images.length > MAX_MOMENT_IMAGES) {
            throw new BadRequestException('MOMENT_IMAGE_LIMIT_EXCEEDED');
        }

        const existingImages = await this.momentImagesRepository.findByObjectKeys(objectKeys);

        if (existingImages.length > 0) {
            throw new ConflictException('MOMENT_IMAGE_ALREADY_REGISTERED');
        }

        const verifiedImages = await Promise.all(
            dto.images.map(async (image) => {
                const metadata = await this.r2StorageService.getObjectMetadata(image.objectKey);

                if (!metadata) {
                    throw new BadRequestException('MOMENT_IMAGE_OBJECT_NOT_FOUND');
                }

                if (!metadata.contentType || !ALLOWED_IMAGE_CONTENT_TYPES.has(metadata.contentType)) {
                    throw new BadRequestException(
                        'UNSUPPORTED_IMAGE_CONTENT_TYPE',
                    );
                }

                if (
                    metadata.sizeBytes === null ||
                    metadata.sizeBytes < 1 ||
                    metadata.sizeBytes > MAX_IMAGE_SIZE_BYTES
                ) {
                    throw new BadRequestException('INVALID_MOMENT_IMAGE_SIZE');
                }

                return {
                    ...image,
                    mimeType: metadata.contentType,
                    sizeBytes: metadata.sizeBytes,
                };
            }),
        );

        const maxSortOrder = await this.momentImagesRepository.findMaxSortOrderByMomentId(momentId);

        const images = await this.momentImagesRepository.createMany(
            verifiedImages.map((image, index) => ({
                momentId,
                objectKey: image.objectKey,
                sortOrder: maxSortOrder + index + 1,
                width: image.width,
                height: image.height,
                mimeType: image.mimeType,
                sizeBytes: image.sizeBytes,
                takenAt: image.takenAt ? new Date(image.takenAt) : undefined,
            })),
        );

        return {
            items: images.map((image) =>
                toMomentImageResponse(image, this.r2StorageService.getPublicUrl(image.objectKey)),
            ),
        };
    }

    async updateImageOrder(
        userId: string,
        momentId: string,
        dto: UpdateMomentImageOrderDto,
    ): Promise<MomentImageListResponseDto> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const uniqueImageIds = new Set(dto.imageIds);

        if (uniqueImageIds.size !== dto.imageIds.length) {
            throw new BadRequestException('DUPLICATE_MOMENT_IMAGE_ID');
        }

        const currentImages = await this.momentImagesRepository.findManyByMomentId(momentId);

        if (currentImages.length !== dto.imageIds.length) {
            throw new BadRequestException('INVALID_MOMENT_IMAGE_ORDER');
        }

        const currentImageIds = new Set(currentImages.map((image) => image.id));

        const hasInvalidImage = dto.imageIds.some((imageId) => !currentImageIds.has(imageId));

        if (hasInvalidImage) {
            throw new BadRequestException('INVALID_MOMENT_IMAGE_ORDER');
        }

        const images =
            await this.momentImagesRepository.updateSortOrders(
                dto.imageIds.map((imageId, index) => ({
                    id: imageId,
                    sortOrder: index,
                })),
            );

        images.sort((a, b) => a.sortOrder - b.sortOrder);

        return {
            items: images.map((image) =>
                toMomentImageResponse(image, this.r2StorageService.getPublicUrl(image.objectKey)),
            ),
        };
    }

    async deleteImage(
        userId: string,
        momentId: string,
        imageId: string,
    ): Promise<void> {
        await this.momentsQueryService.getOwnedActiveMoment(userId, momentId);

        const image =
            await this.momentImagesRepository.findByIdAndMomentId(
                imageId,
                momentId,
            );

        if (!image) {
            throw new NotFoundException('MOMENT_IMAGE_NOT_FOUND');
        }

        await this.momentImagesRepository.deleteById(image.id);

        try {
            await this.r2StorageService.deleteObject(image.objectKey);
        } catch (error) {
            this.logger.warn(
                `Failed to delete R2 object after MomentImage deletion: ${image.objectKey}`,
            );
        }
    }
}