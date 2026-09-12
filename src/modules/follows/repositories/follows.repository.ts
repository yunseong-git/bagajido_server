import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

import { followerInclude, followingInclude } from '../types/follow-with-user.type';
import type { FindFollowsInput, FollowsRepository } from './follows.repository.interface';

@Injectable()
export class FollowsPrismaRepository implements FollowsRepository {
    constructor(private readonly prisma: PrismaService) { }

    findActiveUserById(userId: string): Promise<{ id: string } | null> {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
                status: UserStatus.ACTIVE,
            },
            select: {
                id: true,
            },
        });
    }

    findByUsers(
        followerId: string,
        followingId: string,
    ) {
        return this.prisma.userFollow.findFirst({
            where: {
                followerId,
                followingId,
            },
        });
    }

    create(
        followerId: string,
        followingId: string,
    ) {
        return this.prisma.userFollow.create({
            data: {
                follower: {
                    connect: {
                        id: followerId,
                    },
                },
                following: {
                    connect: {
                        id: followingId,
                    },
                },
            },
        });
    }

    async deleteById(followId: string): Promise<void> {
        await this.prisma.userFollow.delete({
            where: {
                id: followId,
            },
        });
    }

    async findFollowers(input: FindFollowsInput) {
        const where = {
            followingId: input.userId,
            follower: {
                status: UserStatus.ACTIVE,
            },
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.userFollow.findMany({
                where,
                include: followerInclude,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.userFollow.count({
                where,
            }),
        ]);

        return {
            items,
            total,
        };
    }

    async findFollowing(input: FindFollowsInput) {
        const where = {
            followerId: input.userId,
            following: {
                status: UserStatus.ACTIVE,
            },
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.userFollow.findMany({
                where,
                include: followingInclude,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.userFollow.count({
                where,
            }),
        ]);

        return {
            items,
            total,
        };
    }

    countFollowers(userId: string): Promise<number> {
        return this.prisma.userFollow.count({
            where: {
                followingId: userId,
                follower: {
                    status: UserStatus.ACTIVE,
                },
            },
        });
    }

    countFollowing(userId: string): Promise<number> {
        return this.prisma.userFollow.count({
            where: {
                followerId: userId,
                following: {
                    status: UserStatus.ACTIVE,
                },
            },
        });
    }
}