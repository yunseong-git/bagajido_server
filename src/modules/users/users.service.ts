import { Injectable } from '@nestjs/common';
import { UsersPrismaRepository } from './users.repository';
import type { UpsertOAuthUserInput } from './users.repository.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersPrismaRepository) {}

  // 1. 기존 upsert 로직 (Repository와 연결)
  async upsertFromOAuth(input: UpsertOAuthUserInput) {
    return await this.usersRepository.upsertFromOAuth(input);
  }

  // 2. Auth 모듈에서 호출할 유저 동기화 브릿지
  async syncUserWithAuth(authPayload: any) {
    // Supabase나 타 OAuth에서 준 raw 데이터를 우리 규격에 맞게 정제
    return await this.upsertFromOAuth({
      oauth_provider: authPayload.provider || 'oauth2',
      oauth_subject: authPayload.sub || authPayload.id,
      email: authPayload.email,
      display_name: authPayload.full_name || authPayload.name,
    });
  }

  async createRandomTestUser() {
    const randomId = Math.random().toString(36).substring(7);
    return await this.upsertFromOAuth({
      oauth_provider: 'test',
      oauth_subject: `test-sub-random-${randomId}`,
      email: `random-${randomId}@bagajido.test`,
      display_name: `신규사냥꾼-${randomId}`,
    });
  }
}