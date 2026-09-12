import type { MomentCommentLike } from '@prisma/client';

export interface MomentCommentLikesRepository {
    findByUserIdAndCommentId(
        userId: string,
        commentId: string,
    ): Promise<MomentCommentLike | null>;

    create(
        userId: string,
        commentId: string,
    ): Promise<MomentCommentLike>;

    delete(
        userId: string,
        commentId: string,
    ): Promise<void>;

    countByCommentId(commentId: string): Promise<number>;
}