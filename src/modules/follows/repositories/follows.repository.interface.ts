import type { UserFollow } from '@prisma/client';

import type {
    FollowWithFollower,
    FollowWithFollowing,
} from '../types/follow-with-user.type';

export interface FindFollowsInput {
    userId: string;
    skip: number;
    take: number;
}

export interface FollowListResult<T> {
    items: T[];
    total: number;
}

export interface FollowsRepository {
    findActiveUserById(
        userId: string,
    ): Promise<{ id: string } | null>;

    findByUsers(
        followerId: string,
        followingId: string,
    ): Promise<UserFollow | null>;

    findFollowers(
        input: FindFollowsInput,
    ): Promise<FollowListResult<FollowWithFollower>>;

    findFollowing(
        input: FindFollowsInput,
    ): Promise<FollowListResult<FollowWithFollowing>>;

    countFollowers(userId: string): Promise<number>;

    countFollowing(userId: string): Promise<number>;

    create(
        followerId: string,
        followingId: string,
    ): Promise<UserFollow>;

    deleteById(followId: string): Promise<void>;
}