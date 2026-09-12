import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MomentCommentStatus } from '@prisma/client';

import type { CreateMomentCommentDto } from '../dto/comment/req/create-moment-comment.dto';
import type { MomentCommentListResponseDto } from '../dto/comment/res/moment-comment-list-response.dto';
import type { MomentCommentResponseDto } from '../dto/comment/res/moment-comment-response.dto';
import type { UpdateMomentCommentDto } from '../dto/comment/req/update-moment-comment.dto';

import { toMomentCommentResponse } from '../mappers/moment-comment-response.mapper';

import { MomentCommentsPrismaRepository } from '../repositories/comment/moment-comments.repository';

import { MomentsQueryService } from './moments-query.service';

@Injectable()
export class MomentCommentsService {
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly momentCommentsRepository: MomentCommentsPrismaRepository,
    ) { }

    /** 내부 도메인용 */
    async getActiveComment(
        momentId: string,
        commentId: string,
    ) {
        const comment =
            await this.momentCommentsRepository.findById(commentId);
    
        if (
            !comment ||
            comment.momentId !== momentId ||
            comment.status !== MomentCommentStatus.ACTIVE
        ) {
            throw new NotFoundException('MOMENT_COMMENT_NOT_FOUND');
        }
    
        return comment;
    }

    async getComments(
        momentId: string,
    ): Promise<MomentCommentListResponseDto> {
        await this.momentsQueryService.getPublicActiveMoment(momentId);

        const comments =
            await this.momentCommentsRepository.findManyByMomentId(momentId);

        return {
            items: comments.map(toMomentCommentResponse),
        };
    }

    async createComment(
        userId: string,
        momentId: string,
        dto: CreateMomentCommentDto,
    ): Promise<MomentCommentResponseDto> {
        await this.momentsQueryService.getPublicActiveMoment(momentId);

        const content = dto.content.trim();

        if (!content) {
            throw new BadRequestException('EMPTY_MOMENT_COMMENT');
        }

        if (dto.parentId) {
            await this.validateParentComment(momentId, dto.parentId);
        }

        const comment = await this.momentCommentsRepository.create({
            userId,
            momentId,
            parentId: dto.parentId,
            content,
            languageCode: dto.languageCode?.trim() || undefined,
        });

        return toMomentCommentResponse(comment);
    }

    async updateComment(
        userId: string,
        momentId: string,
        commentId: string,
        dto: UpdateMomentCommentDto,
    ): Promise<MomentCommentResponseDto> {
        await this.momentsQueryService.getPublicActiveMoment(momentId);

        const comment =
            await this.momentCommentsRepository.findByIdAndMomentIdAndUserId(
                commentId,
                momentId,
                userId,
            );

        if (!comment || comment.status !== MomentCommentStatus.ACTIVE) {
            throw new NotFoundException('MOMENT_COMMENT_NOT_FOUND');
        }

        if (
            dto.content === undefined &&
            dto.languageCode === undefined
        ) {
            throw new BadRequestException('NO_MOMENT_COMMENT_CHANGES');
        }

        const content =
            dto.content !== undefined
                ? dto.content.trim()
                : undefined;

        if (dto.content !== undefined && !content) {
            throw new BadRequestException('EMPTY_MOMENT_COMMENT');
        }

        const updatedComment =
            await this.momentCommentsRepository.update(
                commentId,
                {
                    content,
                    languageCode:
                        dto.languageCode !== undefined
                            ? dto.languageCode.trim() || null
                            : undefined,
                    editedAt: new Date(),
                },
            );

        return toMomentCommentResponse(updatedComment);
    }

    async deleteComment(
        userId: string,
        momentId: string,
        commentId: string,
    ): Promise<void> {
        const comment =
            await this.momentCommentsRepository.findByIdAndMomentIdAndUserId(
                commentId,
                momentId,
                userId,
            );
    
        if (!comment || comment.status !== MomentCommentStatus.ACTIVE) {
            return;
        }
    
        await this.momentCommentsRepository.update(
            commentId,
            {
                content: undefined,
                status: MomentCommentStatus.DELETED,
                deletedAt: new Date(),
            },
        );
    }

    private async validateParentComment(
        momentId: string,
        parentId: string,
    ): Promise<void> {
        const parent =
            await this.momentCommentsRepository.findById(parentId);

        if (!parent || parent.momentId !== momentId) {
            throw new NotFoundException('MOMENT_COMMENT_PARENT_NOT_FOUND');
        }

        if (parent.status !== MomentCommentStatus.ACTIVE) {
            throw new BadRequestException('MOMENT_COMMENT_PARENT_NOT_AVAILABLE');
        }

        if (parent.parentId) {
            throw new BadRequestException('MOMENT_COMMENT_REPLY_DEPTH_EXCEEDED');
        }
    }
}