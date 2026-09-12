import type { MomentImage } from '@prisma/client';

import type { MomentImageResponseDto } from '../dto/image/res/moment-image-response.dto';

export function toMomentImageResponse(
    image: MomentImage,
    imageUrl: string,
): MomentImageResponseDto {
    return {
        id: image.id,
        momentId: image.momentId,
        storageProvider: image.storageProvider,
        objectKey: image.objectKey,
        imageUrl,
        sortOrder: image.sortOrder,
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        sizeBytes: image.sizeBytes,
        takenAt: image.takenAt,
        createdAt: image.createdAt,
    };
}