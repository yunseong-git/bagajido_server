import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MomentCommentLikesPrismaRepository } from '../repositories/comment-like/moment-comment-likes.repository';

import { MomentCommentsService } from './moment-comments.service';
import { MomentsQueryService } from './moments-query.service';

@Injectable()
export class MomentCommentLikesService {
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly momentCommentsService: MomentCommentsService,
        private readonly momentCommentLikesRepository: MomentCommentLikesPrismaRepository,
    ) {}

    async likeComment(
        userId: string,
        momentId: string,
        commentId: string,
    ): Promise<void> {
        await this.momentsQueryService.getPublicActiveMoment(momentId);

        await this.momentCommentsService.getActiveComment(
            momentId,
            commentId,
        );

        const existingLike =
            await this.momentCommentLikesRepository
                .findByUserIdAndCommentId(
                    userId,
                    commentId,
                );

        if (existingLike) {
            throw new ConflictException('MOMENT_COMMENT_ALREADY_LIKED');
        }

        try {
            await this.momentCommentLikesRepository.create(
                userId,
                commentId,
            );
        } catch (error) {
            const isUniqueError =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002';

            if (isUniqueError) {
                throw new ConflictException(
                    'MOMENT_COMMENT_ALREADY_LIKED',
                );
            }

            throw error;
        }
    }

    async unlikeComment(
        userId: string,
        commentId: string,
    ): Promise<void> {
        const existingLike =
            await this.momentCommentLikesRepository
                .findByUserIdAndCommentId(
                    userId,
                    commentId,
                );

        if (!existingLike) return;

        await this.momentCommentLikesRepository.delete(
            userId,
            commentId,
        );
    }
}