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
import { AuthGuard } from '@nestjs/passport';
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
import { AuthMeResponseDto, AuthTokenPairResponseDto } from './dto/res/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('oauth2/login')
  @UseGuards(AuthGuard('oauth2'))
  @ApiOperation({ summary: 'OAuth2 로그인 시작 (Passport 리다이렉트)' })
  oauth2Login() {
    /* Passport가 인가 URL로 리다이렉트 */
  }

  @Get('oauth2/callback')
  @UseGuards(AuthGuard('oauth2'))
  @ApiOperation({ summary: 'OAuth2 콜백 후 JWT 발급' })
  @ApiOkResponse({ type: AuthTokenPairResponseDto })
  async oauth2Callback(@Req() req: Request & { user: { id: string } }) {
    return this.authService.issueTokens(req.user.id);
  }

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
}
