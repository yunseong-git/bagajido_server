import { Prisma } from '@prisma/client';

export const followerInclude = {
    follower: {
        select: {
            id: true,
            username: true,
            displayName: true,
            profileImageKey: true,
        },
    },
} satisfies Prisma.UserFollowInclude;

export const followingInclude = {
    following: {
        select: {
            id: true,
            username: true,
            displayName: true,
            profileImageKey: true,
        },
    },
} satisfies Prisma.UserFollowInclude;

export type FollowWithFollower = Prisma.UserFollowGetPayload<{
    include: typeof followerInclude;
}>;

export type FollowWithFollowing = Prisma.UserFollowGetPayload<{
    include: typeof followingInclude;
}>;