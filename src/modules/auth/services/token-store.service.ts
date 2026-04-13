import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';

@Injectable()
export class TokenStoreService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(jti: string) {
    return `refresh:${jti}`;
  }

  async saveRefreshJti(jti: string, user_id: string, ttl_seconds: number) {
    await this.redis.set(this.key(jti), user_id, 'EX', ttl_seconds);
  }

  async getUserIdForRefreshJti(jti: string): Promise<string | null> {
    return this.redis.get(this.key(jti));
  }

  async revokeRefreshJti(jti: string) {
    await this.redis.del(this.key(jti));
  }
}
