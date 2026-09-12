export interface PublicUserProfile {
    id: string;
    username: string;
    displayName: string;
    profileImageKey: string | null;
}

export interface PublicUserProfileCounts {
    followerCount: number;
    followingCount: number;
    publicMomentCount: number;
}

export interface UserProfilesRepository {
    findActiveUserProfile(
        userId: string,
    ): Promise<PublicUserProfile | null>;

    getPublicProfileCounts(
        userId: string,
    ): Promise<PublicUserProfileCounts>;
}