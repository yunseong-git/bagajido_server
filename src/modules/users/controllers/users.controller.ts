import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentAuthUser } from '../../auth/decorators/current-auth-user.decorator';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth.guard';
import type { AuthUser } from '../../auth/types/auth-user.type';

import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UserResponseDto } from '../dto/res/user-response.dto';

import { UsersService } from './users.service';

/**
 * 초기 로그인 흐름
 *
 * Supabase 로그인 → GET /users/me
 * 200 → 이미 Bagajido 가입 완료
 * 404 USER_PROFILE_NOT_FOUND → 온보딩 화면에서 username/displayName 입력 → POST /users/me
 */
@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('me')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({
        summary: 'Bagajido 사용자 프로필 생성',
        description: 'Supabase Auth 회원가입 이후 Bagajido User를 생성합니다.',
    })
    @ApiCreatedResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Supabase Access Token이 없거나 유효하지 않음' })
    @ApiConflictResponse({ description: '이미 등록된 사용자 또는 중복 username' })
    createMe(@CurrentAuthUser() authUser: AuthUser, @Body() dto: CreateUserDto) {
        return this.usersService.createMe(authUser.authUserId, dto);
    }

    @Get('me')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: '내 Bagajido 프로필 조회' })
    @ApiOkResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse({
        description: 'Supabase 로그인은 되어 있지만 Bagajido 프로필이 아직 없음',
    })
    getMe(@CurrentAuthUser() authUser: AuthUser) {
        return this.usersService.getMe(authUser.authUserId);
    }

    @Patch('me')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: '내 Bagajido 프로필 수정' })
    @ApiOkResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiConflictResponse({ description: '변경하려는 username이 이미 사용 중' })
    updateMe(@CurrentAuthUser() authUser: AuthUser, @Body() dto: UpdateUserDto) {
        return this.usersService.updateMe(authUser.authUserId, dto);
    }
}
