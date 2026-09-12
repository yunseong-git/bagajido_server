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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { MomentLikesService } from '../services/moment-likes.service';

@ApiTags('Moment Likes')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller('moments/:momentId/like')
export class MomentLikesController {
    constructor(private readonly momentLikesService: MomentLikesService) { }

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Moment 좋아요' })
    async likeMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<void> {
        await this.momentLikesService.likeMoment(user.id, momentId);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Moment 좋아요 취소' })
    async unlikeMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<void> {
        await this.momentLikesService.unlikeMoment(user.id, momentId);
    }
}