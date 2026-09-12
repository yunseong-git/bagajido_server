import type { MomentLike } from '@prisma/client';

export interface MomentLikesRepository {
    findByUserIdAndMomentId(
        userId: string,
        momentId: string,
    ): Promise<MomentLike | null>;

    findLikedMomentIds(
        userId: string,
        momentIds: string[],
    ): Promise<string[]>;

    create(
        userId: string,
        momentId: string,
    ): Promise<MomentLike>;

    delete(
        userId: string,
        momentId: string,
    ): Promise<void>;

    countByMomentId(momentId: string): Promise<number>;
}