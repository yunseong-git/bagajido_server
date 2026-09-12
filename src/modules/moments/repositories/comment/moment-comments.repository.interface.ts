import type { MomentComment, MomentCommentStatus } from '@prisma/client';

import type { MomentCommentWithUser } from '../../types/moment-comment-with-user.type';

export interface CreateMomentCommentInput {
    momentId: string;
    userId: string;
    parentId?: string;
    content: string;
    languageCode?: string;
}

export interface UpdateMomentCommentInput {
    content?: string;
    languageCode?: string | null;
    editedAt?: Date;
    status?: MomentCommentStatus;
    deletedAt?: Date | null;
}

export interface MomentCommentsRepository {
    findById(commentId: string): Promise<MomentComment | null>;

    findByIdAndMomentIdAndUserId(
        commentId: string,
        momentId: string,
        userId: string,
    ): Promise<MomentCommentWithUser | null>;

    findManyByMomentId(
        momentId: string,
    ): Promise<MomentCommentWithUser[]>;

    create(
        input: CreateMomentCommentInput,
    ): Promise<MomentCommentWithUser>;

    update(
        commentId: string,
        input: UpdateMomentCommentInput,
    ): Promise<MomentCommentWithUser>;
}