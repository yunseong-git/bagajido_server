import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';

import type { MomentCommentLikesRepository } from './moment-comment-likes.repository.interface';

@Injectable()
export class MomentCommentLikesPrismaRepository
    implements MomentCommentLikesRepository
{
    constructor(private readonly prisma: PrismaService) {}

    findByUserIdAndCommentId(
        userId: string,
        commentId: string,
    ) {
        return this.prisma.momentCommentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    }

    create(
        userId: string,
        commentId: string,
    ) {
        return this.prisma.momentCommentLike.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                comment: {
                    connect: {
                        id: commentId,
                    },
                },
            },
        });
    }

    async delete(
        userId: string,
        commentId: string,
    ): Promise<void> {
        await this.prisma.momentCommentLike.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    }

    countByCommentId(commentId: string): Promise<number> {
        return this.prisma.momentCommentLike.count({
            where: {
                commentId,
            },
        });
    }
}