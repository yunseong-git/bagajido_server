import { Injectable } from '@nestjs/common';
import {
    MomentStatus,
    MomentVisibility,
    UserStatus,
} from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

import type {
    PublicUserProfileCounts,
    UserProfilesRepository,
} from './user-profiles.repository.interface';

@Injectable()
export class UserProfilesPrismaRepository
    implements UserProfilesRepository
{
    constructor(private readonly prisma: PrismaService) {}

    findActiveUserProfile(userId: string) {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
                status: UserStatus.ACTIVE,
            },
            select: {
                id: true,
                username: true,
                displayName: true,
                profileImageKey: true,
            },
        });
    }

    async getPublicProfileCounts(
        userId: string,
    ): Promise<PublicUserProfileCounts> {
        const [
            followerCount,
            followingCount,
            publicMomentCount,
        ] = await this.prisma.$transaction([
            this.prisma.userFollow.count({
                where: {
                    followingId: userId,
                    follower: {
                        status: UserStatus.ACTIVE,
                    },
                },
            }),

            this.prisma.userFollow.count({
                where: {
                    followerId: userId,
                    following: {
                        status: UserStatus.ACTIVE,
                    },
                },
            }),

            this.prisma.moment.count({
                where: {
                    userId,
                    visibility: MomentVisibility.PUBLIC,
                    status: MomentStatus.ACTIVE,
                },
            }),
        ]);

        return {
            followerCount,
            followingCount,
            publicMomentCount,
        };
    }
}