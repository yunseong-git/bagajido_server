import type { FollowUserResponseDto } from '../dto/res/follow-user-response.dto';

import type {
    FollowWithFollower,
    FollowWithFollowing,
} from '../types/follow-with-user.type';

export function toFollowerResponse(
    follow: FollowWithFollower,
): FollowUserResponseDto {
    return {
        id: follow.follower.id,
        username: follow.follower.username,
        displayName: follow.follower.displayName,
        profileImageKey: follow.follower.profileImageKey,
        followedAt: follow.createdAt,
    };
}

export function toFollowingResponse(
    follow: FollowWithFollowing,
): FollowUserResponseDto {
    return {
        id: follow.following.id,
        username: follow.following.username,
        displayName: follow.following.displayName,
        profileImageKey: follow.following.profileImageKey,
        followedAt: follow.createdAt,
    };
}