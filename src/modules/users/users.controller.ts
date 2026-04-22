import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard'; // 나중에 연결
import { TestLoginDto } from './dto/test-login.dto';
import { StoresService } from '../stores/stores.service';

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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 프로필 조회' })
  async getMyProfile(
    // Intersection Type을 써서 req.user의 존재를 알려줍니다.
    @Req() req: Request & { user?: { id: string } }
  ) {
    if (!req.user) {
      return { message: '로그인이 필요하거나 가드가 설정되지 않았습니다.' };
    }
    // 나중에 이 ID로 서비스에서 유저 정보를 가져오면 끝!
    return { user: req.user };
  }

  @Get('me/liked-stores')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내가 좋아요한 가게 목록 조회' })
  async getMyLikedStores(@Req() req: Request & { user: { id: string } }) {
    return this.storesService.findMyLikedStores(req.user.id);
  }

  @Get('me/picked-stores')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내가 찜한 가게 목록 조회' })
  async getMyPickedStores(@Req() req: Request & { user: { id: string } }) {
    return this.storesService.findMyPickedStores(req.user.id);
  }
}