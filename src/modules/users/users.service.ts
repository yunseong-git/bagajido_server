import { Injectable } from '@nestjs/common';
import { UsersPrismaRepository } from './users.repository';
import type { UpsertOAuthUserInput } from './users.repository.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersPrismaRepository) {}

  upsertFromOAuth(input: UpsertOAuthUserInput) {
    return this.usersRepository.upsertFromOAuth(input);
  }
}
