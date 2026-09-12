import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { GetFollowsDto } from '../dto/req/get-follows.dto';
import type { FollowUserListResponseDto } from '../dto/res/follow-user-list-response.dto';

import { FollowsQueryService } from '../services/follows-query.service';

@ApiTags('Follows')
@Controller('users/:userId')
export class FollowsQueryController {
    constructor(
        private readonly followsQueryService: FollowsQueryService,
    ) {}

    @Get('followers')
    @ApiOperation({
        summary: '유저 팔로워 목록 조회',
    })
    getFollowers(
        @Param('userId', new ParseUUIDPipe()) userId: string,
        @Query() dto: GetFollowsDto,
    ): Promise<FollowUserListResponseDto> {
        return this.followsQueryService.getFollowers(
            userId,
            dto,
        );
    }

    @Get('following')
    @ApiOperation({
        summary: '유저 팔로잉 목록 조회',
    })
    getFollowing(
        @Param('userId', new ParseUUIDPipe()) userId: string,
        @Query() dto: GetFollowsDto,
    ): Promise<FollowUserListResponseDto> {
        return this.followsQueryService.getFollowing(
            userId,
            dto,
        );
    }
}