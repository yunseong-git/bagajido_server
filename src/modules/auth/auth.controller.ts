import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './services/auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthMeResponseDto, AuthTokenPairResponseDto } from './dto/res/auth-response.dto';
import { SyncUserDto } from './dto/sync-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '리프레시 토큰으로 재발급' })
  @ApiOkResponse({ type: AuthTokenPairResponseDto })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.rotateRefreshToken(body.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '리프레시 토큰 폐기' })
  @ApiNoContentResponse()
  async logout(@Body() body: RefreshTokenDto) {
    await this.authService.logout(body.refresh_token);
  }

  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '액세스 토큰 검증 스텁' })
  @ApiOkResponse({ type: AuthMeResponseDto })
  me(@Req() req: Request & { user: { oauth_subject: string } }) {
    return { oauth_subject: req.user.oauth_subject };
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Supabase JWT 기반 사용자 동기화' })
  async sync(
    @Req() req: Request & { user: { oauth_subject: string; email?: string | null } },
    @Body() body: SyncUserDto,
  ) {
    return this.authService.syncUser(
      {
        oauth_subject: req.user.oauth_subject,
        email: req.user.email ?? null,
      },
      body,
    );
  }
}
