import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type { GetFollowsDto } from '../dto/req/get-follows.dto';
import type { FollowUserListResponseDto } from '../dto/res/follow-user-list-response.dto';

import {
    toFollowerResponse,
    toFollowingResponse,
} from '../mappers/follow-response.mapper';

import { FollowsPrismaRepository } from '../repositories/follows.repository';

@Injectable()
export class FollowsQueryService {
    constructor(
        private readonly followsRepository: FollowsPrismaRepository,
    ) {}

    async getFollowers(
        userId: string,
        dto: GetFollowsDto,
    ): Promise<FollowUserListResponseDto> {
        await this.ensureActiveUser(userId);

        const result =
            await this.followsRepository.findFollowers({
                userId,
                skip: (dto.page - 1) * dto.limit,
                take: dto.limit,
            });

        return {
            items: result.items.map(toFollowerResponse),
            page: dto.page,
            limit: dto.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / dto.limit),
        };
    }

    async getFollowing(
        userId: string,
        dto: GetFollowsDto,
    ): Promise<FollowUserListResponseDto> {
        await this.ensureActiveUser(userId);

        const result =
            await this.followsRepository.findFollowing({
                userId,
                skip: (dto.page - 1) * dto.limit,
                take: dto.limit,
            });

        return {
            items: result.items.map(toFollowingResponse),
            page: dto.page,
            limit: dto.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / dto.limit),
        };
    }

    async getFollowerCount(userId: string): Promise<number> {
        return this.followsRepository.countFollowers(userId);
    }

    async getFollowingCount(userId: string): Promise<number> {
        return this.followsRepository.countFollowing(userId);
    }

    private async ensureActiveUser(userId: string): Promise<void> {
        const user =
            await this.followsRepository.findActiveUserById(userId);

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }
    }
}