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

import { FollowsCommandService } from '../services/follows-command.service';

@ApiTags('Follows')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller('users/:userId/follow')
export class FollowsController {
    constructor(
        private readonly followsCommandService: FollowsCommandService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: '유저 팔로우',
    })
    async followUser(
        @CurrentUserEntity() user: CurrentUser,
        @Param('userId', new ParseUUIDPipe()) userId: string,
    ): Promise<void> {
        await this.followsCommandService.followUser(
            user.id,
            userId,
        );
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: '유저 언팔로우',
    })
    async unfollowUser(
        @CurrentUserEntity() user: CurrentUser,
        @Param('userId', new ParseUUIDPipe()) userId: string,
    ): Promise<void> {
        await this.followsCommandService.unfollowUser(
            user.id,
            userId,
        );
    }
}