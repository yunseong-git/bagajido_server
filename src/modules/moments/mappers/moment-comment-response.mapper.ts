import { MomentCommentStatus } from '@prisma/client';

import type { MomentCommentResponseDto } from '../dto/comment/res/moment-comment-response.dto';
import type { MomentCommentWithUser } from '../types/moment-comment-with-user.type';

export function toMomentCommentResponse(comment: MomentCommentWithUser): MomentCommentResponseDto {
    const isDeleted = comment.status === MomentCommentStatus.DELETED;

    return {
        id: comment.id,
        momentId: comment.momentId,
        parentId: comment.parentId,
        content: isDeleted ? null : comment.content,
        languageCode: comment.languageCode,
        isDeleted,
        user: {
            id: comment.user.id,
            username: comment.user.username,
            displayName: comment.user.displayName,
            profileImageKey: comment.user.profileImageKey,
        },
        editedAt: comment.editedAt,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    };
}