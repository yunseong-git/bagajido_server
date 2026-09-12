import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { MomentCommentLikesService } from '../services/moment-comment-like.service';

@ApiTags('Moment Comment Likes')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller(
    'moments/:momentId/comments/:commentId/like',
)
export class MomentCommentLikesController {
    constructor(
        private readonly momentCommentLikesService: MomentCommentLikesService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Moment 댓글 좋아요',
    })
    async likeComment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Param('commentId', new ParseUUIDPipe()) commentId: string,
    ): Promise<void> {
        await this.momentCommentLikesService.likeComment(
            user.id,
            momentId,
            commentId,
        );
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Moment 댓글 좋아요 취소',
    })
    async unlikeComment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('commentId', new ParseUUIDPipe()) commentId: string,
    ): Promise<void> {
        await this.momentCommentLikesService.unlikeComment(
            user.id,
            commentId,
        );
    }
}