import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import type { PublicUserProfileResponseDto } from '../dto/res/public-user-profile-response.dto';

import { UsersPublicQueryService } from '../services/users-public-query.service';

@ApiTags('Users')
@Controller('users')
export class PublicUsersController {
    constructor(
        private readonly usersPublicQueryService: UsersPublicQueryService,
    ) {}

    @Get(':userId/profile')
    @ApiOperation({
        summary: '유저 공개 프로필 조회',
    })
    getPublicProfile(
        @Param('userId', new ParseUUIDPipe()) userId: string,
    ): Promise<PublicUserProfileResponseDto> {
        return this.usersPublicQueryService.getPublicProfile(
            userId,
        );
    }
}