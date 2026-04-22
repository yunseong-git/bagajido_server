import { Injectable } from '@nestjs/common';

type RefreshTokenRecord = {
  user_id: string;
  expires_at: number;
};

@Injectable()
export class TokenStoreService {
  private readonly refreshTokens = new Map<string, RefreshTokenRecord>();

  async saveRefreshJti(jti: string, user_id: string, ttl_seconds: number) {
    const expires_at = Date.now() + ttl_seconds * 1000;
    this.refreshTokens.set(jti, { user_id, expires_at });
  }

  async getUserIdForRefreshJti(jti: string) {
    const token = this.refreshTokens.get(jti);
    if (!token) {
      return null;
    }

    if (token.expires_at <= Date.now()) {
      this.refreshTokens.delete(jti);
      return null;
    }

    return token.user_id;
  }

  async revokeRefreshJti(jti: string) {
    this.refreshTokens.delete(jti);
  }
}
