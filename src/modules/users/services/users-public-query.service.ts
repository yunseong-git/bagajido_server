import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type { PublicUserProfileResponseDto } from '../dto/res/public-user-profile-response.dto';

import { UserProfilesPrismaRepository } from '../repositories/user-profiles.repository';

@Injectable()
export class UsersPublicQueryService {
    constructor(
        private readonly userProfilesRepository: UserProfilesPrismaRepository,
    ) {}

    async getPublicProfile(
        userId: string,
    ): Promise<PublicUserProfileResponseDto> {
        const user =
            await this.userProfilesRepository.findActiveUserProfile(
                userId,
            );

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        const counts =
            await this.userProfilesRepository.getPublicProfileCounts(
                userId,
            );

        return {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            profileImageKey: user.profileImageKey,
            followerCount: counts.followerCount,
            followingCount: counts.followingCount,
            publicMomentCount: counts.publicMomentCount,
        };
    }
}