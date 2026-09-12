import { randomUUID } from 'crypto';

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

export function createMomentImageObjectKey(
    userId: string,
    momentId: string,
    contentType: string,
): string {
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType];

    if (!extension) {
        throw new Error('UNSUPPORTED_IMAGE_CONTENT_TYPE');
    }

    return `moments/${userId}/${momentId}/${randomUUID()}.${extension}`;
}