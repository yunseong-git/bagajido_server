import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UpsertOAuthUserInput, UsersRepository } from './users.repository.interface';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromOAuth(input: UpsertOAuthUserInput): Promise<{ id: string }> {
    const row = await this.prisma.user.upsert({
      where: {
        oauth_provider_oauth_subject: {
          oauth_provider: input.oauth_provider,
          oauth_subject: input.oauth_subject,
        },
      },
      create: {
        oauth_provider: input.oauth_provider,
        oauth_subject: input.oauth_subject,
        email: input.email ?? undefined,
        display_name: input.display_name ?? undefined,
      },
      update: {
        email: input.email ?? undefined,
        display_name: input.display_name ?? undefined,
      },
      select: { id: true },
    });
    return { id: row.id };
  }
}
