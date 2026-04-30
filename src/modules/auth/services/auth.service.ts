import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { TokenStoreService } from './token-store.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SyncUserDto } from '../dto/sync-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokenStore: TokenStoreService,
    private readonly prisma: PrismaService,
  ) {}

  private accessTtlSeconds() {
    return this.config.get<number>('JWT_ACCESS_TTL_SECONDS', 900);
  }

  private refreshTtlSeconds() {
    return this.config.get<number>('JWT_REFRESH_TTL_SECONDS', 604800);
  }

  async issueTokens(user_id: string) {
    const access_secret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refresh_secret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    const jti = randomUUID();
    const access_ttl = this.accessTtlSeconds();
    const refresh_ttl = this.refreshTtlSeconds();

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user_id },
        { secret: access_secret, expiresIn: access_ttl },
      ),
      this.jwtService.signAsync(
        { sub: user_id, jti },
        { secret: refresh_secret, expiresIn: refresh_ttl },
      ),
    ]);

    await this.tokenStore.saveRefreshJti(jti, user_id, refresh_ttl);
    return { access_token, refresh_token, token_type: 'Bearer' as const };
  }

  async rotateRefreshToken(refresh_token: string) {
    const refresh_secret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    let payload: { sub?: string; jti?: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: string; jti: string }>(
        refresh_token,
        { secret: refresh_secret },
      );
    } catch {
      throw new UnauthorizedException('invalid_refresh_token');
    }
    if (!payload.sub || !payload.jti) {
      throw new UnauthorizedException('invalid_refresh_token');
    }
    const stored_user_id = await this.tokenStore.getUserIdForRefreshJti(
      payload.jti,
    );
    if (!stored_user_id || stored_user_id !== payload.sub) {
      throw new UnauthorizedException('refresh_token_revoked');
    }
    await this.tokenStore.revokeRefreshJti(payload.jti);
    return this.issueTokens(payload.sub);
  }

  async logout(refresh_token: string) {
    const refresh_secret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    try {
      const payload = await this.jwtService.verifyAsync<{ jti: string }>(
        refresh_token,
        { secret: refresh_secret },
      );
      if (payload.jti) {
        await this.tokenStore.revokeRefreshJti(payload.jti);
      }
    } catch {
      /* ignore invalid token on logout */
    }
  }

  async syncUser(
    payload: { oauth_subject: string; email?: string | null },
    dto: SyncUserDto,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { oauth_subject: payload.oauth_subject },
    });

    if (!existing) {
      return this.prisma.user.create({
        data: {
          oauth_provider: 'supabase',
          oauth_subject: payload.oauth_subject,
          email: payload.email ?? undefined,
          display_name: dto.nickname ?? undefined,
          region: dto.region ?? undefined,
        },
      });
    }

    return this.prisma.user.update({
      where: { id: existing.id },
      data: {
        email: payload.email ?? undefined,
        display_name: dto.nickname ?? undefined,
        region: dto.region ?? undefined,
      },
    });
  }
}
