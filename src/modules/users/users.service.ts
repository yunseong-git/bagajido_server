import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, User, UserStatus } from '@prisma/client';

import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';

import type { UserResponseDto } from './dto/res/user-response.dto';
import type { CurrentUser } from './types/current-user.type';

import { UsersPrismaRepository } from './users.repository';

/**
 * createMe / updateMe에서 findByUsername()을 먼저 하고도 P2002를 다시 처리하는 이유는
 * 동시 요청 race condition 때문이다.
 *
 * 요청 A username 조회 → 없음
 * 요청 B username 조회 → 없음
 * A INSERT 성공
 * B INSERT 시도
 * → DB UNIQUE가 최종 방어 → Prisma P2002
 */
@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersPrismaRepository) {}

    async createMe(authUserId: string, dto: CreateUserDto): Promise<UserResponseDto> {
        const [existingAuthUser, existingUsername] = await Promise.all([
            this.usersRepository.findByAuthUserId(authUserId),
            this.usersRepository.findByUsername(dto.username),
        ]);

        if (existingAuthUser) throw new ConflictException('USER_ALREADY_REGISTERED');
        if (existingUsername) throw new ConflictException('USERNAME_ALREADY_TAKEN');

        try {
            const user = await this.usersRepository.create({
                authUserId,
                username: dto.username,
                displayName: dto.displayName,
                bio: dto.bio,
                nationalityCode: dto.nationalityCode,
                residenceCountryCode: dto.residenceCountryCode,
                preferredLocale: dto.preferredLocale,
            });

            return this.toResponse(user);
        } catch (error) {
            this.handleUniqueConstraint(error);

            throw error;
        }
    }

    async getMe(authUserId: string): Promise<UserResponseDto> {
        const user = await this.usersRepository.findByAuthUserId(authUserId);

        if (!user) throw new NotFoundException('USER_PROFILE_NOT_FOUND');

        return this.toResponse(user);
    }

    async updateMe(authUserId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.usersRepository.findByAuthUserId(authUserId);

        if (!user) throw new NotFoundException('USER_PROFILE_NOT_FOUND');

        if (dto.username && dto.username !== user.username) {
            const usernameOwner = await this.usersRepository.findByUsername(dto.username);

            if (usernameOwner && usernameOwner.id !== user.id) {
                throw new ConflictException('USERNAME_ALREADY_TAKEN');
            }
        }

        try {
            const updatedUser = await this.usersRepository.updateById(user.id, {
                username: dto.username,
                displayName: dto.displayName,
                bio: dto.bio,
                nationalityCode: dto.nationalityCode,
                residenceCountryCode: dto.residenceCountryCode,
                preferredLocale: dto.preferredLocale,
            });

            return this.toResponse(updatedUser);
        } catch (error) {
            this.handleUniqueConstraint(error);

            throw error;
        }
    }

    async getCurrentUser(authUserId: string): Promise<CurrentUser> {
        const user = await this.usersRepository.findByAuthUserId(authUserId);

        if (!user) throw new ForbiddenException('USER_ONBOARDING_REQUIRED');
        if (user.status === UserStatus.SUSPENDED) throw new ForbiddenException('USER_SUSPENDED');
        if (user.status === UserStatus.WITHDRAWN) throw new ForbiddenException('USER_WITHDRAWN');

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            status: user.status,
        };
    }

    private toResponse(user: User): UserResponseDto {
        return {
            id: user.id,

            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            profileImageKey: user.profileImageKey,

            nationalityCode: user.nationalityCode,
            residenceCountryCode: user.residenceCountryCode,
            preferredLocale: user.preferredLocale,

            role: user.role,
            status: user.status,
            withdrawnAt: user.withdrawnAt,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    private handleUniqueConstraint(error: unknown): void {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
            return;
        }

        const target = JSON.stringify(error.meta?.target ?? '');

        if (target.includes('username')) throw new ConflictException('USERNAME_ALREADY_TAKEN');
        if (target.includes('authUserId')) throw new ConflictException('USER_ALREADY_REGISTERED');

        throw new ConflictException('USER_UNIQUE_CONSTRAINT');
    }
}
