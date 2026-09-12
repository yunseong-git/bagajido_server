import { Injectable } from '@nestjs/common';
import { MomentCommentStatus } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';

import type {
    CreateMomentCommentInput,
    MomentCommentsRepository,
    UpdateMomentCommentInput,
} from './moment-comments.repository.interface';

import { momentCommentWithUserInclude } from '../../types/moment-comment-with-user.type';

@Injectable()
export class MomentCommentsPrismaRepository implements MomentCommentsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findById(commentId: string) {
        return this.prisma.momentComment.findUnique({
            where: {
                id: commentId,
            },
        });
    }

    findManyByMomentId(momentId: string) {
        return this.prisma.momentComment.findMany({
            where: {
                momentId,
                status: {
                    in: [
                        MomentCommentStatus.ACTIVE,
                        MomentCommentStatus.DELETED,
                    ],
                },
            },
            include: momentCommentWithUserInclude,
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    findByIdAndMomentIdAndUserId(
        commentId: string,
        momentId: string,
        userId: string,
    ) {
        return this.prisma.momentComment.findFirst({
            where: {
                id: commentId,
                momentId,
                userId,
            },
            include: momentCommentWithUserInclude,
        });
    }
    
    update(
        commentId: string,
        input: UpdateMomentCommentInput,
    ) {
        return this.prisma.momentComment.update({
            where: {
                id: commentId,
            },
            data: {
                content: input.content,
                languageCode: input.languageCode,
                editedAt: input.editedAt,
                status: input.status,
                deletedAt: input.deletedAt,
            },
            include: momentCommentWithUserInclude,
        });
    }
    

    create(input: CreateMomentCommentInput) {
        return this.prisma.momentComment.create({
            data: {
                moment: {
                    connect: {
                        id: input.momentId,
                    },
                },
                user: {
                    connect: {
                        id: input.userId,
                    },
                },
                parent: input.parentId
                    ? {
                        connect: {
                            id: input.parentId,
                        },
                    }
                    : undefined,
                content: input.content,
                languageCode: input.languageCode,
            },
            include: momentCommentWithUserInclude,
        });
    }
}