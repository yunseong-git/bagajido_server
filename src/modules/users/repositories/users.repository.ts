import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

import type {
    CreateUserInput,
    UpdateUserInput,
    UsersRepository,
} from './users.repository.interface';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    findByAuthUserId(authUserId: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { authUserId } });
    }

    findByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { username } });
    }

    create(input: CreateUserInput): Promise<User> {
        return this.prisma.user.create({
            data: {
                authUserId: input.authUserId,
                username: input.username,
                displayName: input.displayName,

                bio: input.bio,
                nationalityCode: input.nationalityCode,
                residenceCountryCode: input.residenceCountryCode,
                preferredLocale: input.preferredLocale,
            },
        });
    }

    updateById(id: string, input: UpdateUserInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                username: input.username,
                displayName: input.displayName,

                bio: input.bio,
                nationalityCode: input.nationalityCode,
                residenceCountryCode: input.residenceCountryCode,
                preferredLocale: input.preferredLocale,
            },
        });
    }
}
