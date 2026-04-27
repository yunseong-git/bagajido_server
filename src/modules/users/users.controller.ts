import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { TestLoginDto } from './dto/test-login.dto';
import { StoresService } from '../stores/stores.service';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
  ) {}

  @Post('test-login')
  @ApiOperation({ summary: '개발용 테스트 로그인 (기존/신규 선택)' })
  async testLogin(@Body() body: TestLoginDto) {
    // 1. 이메일이 들어오지 않은 경우 -> 완전 새로운 랜덤 유저 생성
    if (!body || !body.email) {
      return await this.usersService.createRandomTestUser();
    }

    // 2. 이메일이 들어온 경우 -> 기존 유저는 로그인, 없으면 해당 이메일로 생성 (Upsert)
    return await this.usersService.upsertFromOAuth({
      oauth_provider: 'test',
      oauth_subject: `test-sub-${body.email}`,
      email: body.email,
      display_name: body.name || '기존테스트유저',
    });
  }

  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 프로필 조회' })
  async getMyProfile(
    @Req() req: Request & { userEntity: { id: string; role: UserRole } }
  ) {
    return { user: req.userEntity };
  }

  @Get('me/liked-stores')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내가 좋아요한 가게 목록 조회' })
  async getMyLikedStores(@Req() req: Request & { userEntity: { id: string } }) {
    return this.storesService.findMyLikedStores(req.userEntity.id);
  }

  @Get('me/picked-stores')
  @UseGuards(JwtAccessAuthGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내가 찜한 가게 목록 조회' })
  async getMyPickedStores(@Req() req: Request & { userEntity: { id: string } }) {
    return this.storesService.findMyPickedStores(req.userEntity.id);
  }
}