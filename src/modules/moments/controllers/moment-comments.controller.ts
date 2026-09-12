import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
    Delete,
    HttpCode,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import type { CurrentUser } from '../../users/types/current-user.type';

import { CreateMomentCommentDto } from '../dto/comment/req/create-moment-comment.dto';
import type { MomentCommentListResponseDto } from '../dto/comment/res/moment-comment-list-response.dto';
import type { MomentCommentResponseDto } from '../dto/comment/res/moment-comment-response.dto';
import type { UpdateMomentCommentDto } from '../dto/comment/req/update-moment-comment.dto';

import { MomentCommentsService } from '../services/moment-comments.service';

@ApiTags('Moment Comments')
@Controller('moments/:momentId/comments')
export class MomentCommentsController {
    constructor(
        private readonly momentCommentsService: MomentCommentsService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Moment 댓글 목록 조회',
    })
    getComments(
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<MomentCommentListResponseDto> {
        return this.momentCommentsService.getComments(momentId);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(RegisteredUserGuard)
    @ApiOperation({
        summary: 'Moment 댓글 또는 답글 작성',
    })
    createComment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: CreateMomentCommentDto,
    ): Promise<MomentCommentResponseDto> {
        return this.momentCommentsService.createComment(
            user.id,
            momentId,
            dto,
        );
    }

    @Patch(':commentId')
    @ApiBearerAuth()
    @UseGuards(RegisteredUserGuard)
    @ApiOperation({ summary: '내 Moment 댓글 수정' })
    updateComment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Param('commentId', new ParseUUIDPipe()) commentId: string,
        @Body() dto: UpdateMomentCommentDto,
    ): Promise<MomentCommentResponseDto> {
        return this.momentCommentsService.updateComment(
            user.id,
            momentId,
            commentId,
            dto,
        );
    }

    @Delete(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(RegisteredUserGuard)
    @ApiOperation({ summary: '내 Moment 댓글 삭제' })
    async deleteComment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Param('commentId', new ParseUUIDPipe()) commentId: string,
    ): Promise<void> {
        await this.momentCommentsService.deleteComment(
            user.id,
            momentId,
            commentId,
        );
    }
}