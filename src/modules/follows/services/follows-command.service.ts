import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { FollowsPrismaRepository } from '../repositories/follows.repository';

@Injectable()
export class FollowsCommandService {
    constructor(
        private readonly followsRepository: FollowsPrismaRepository,
    ) {}

    async followUser(
        followerId: string,
        followingId: string,
    ): Promise<void> {
        if (followerId === followingId) {
            throw new BadRequestException('SELF_FOLLOW_NOT_ALLOWED');
        }

        const followingUser =
            await this.followsRepository.findActiveUserById(
                followingId,
            );

        if (!followingUser) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        const existingFollow =
            await this.followsRepository.findByUsers(
                followerId,
                followingId,
            );

        if (existingFollow) {
            throw new ConflictException('ALREADY_FOLLOWING');
        }

        try {
            await this.followsRepository.create(
                followerId,
                followingId,
            );
        } catch (error) {
            const isUniqueError =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002';

            if (isUniqueError) {
                throw new ConflictException('ALREADY_FOLLOWING');
            }

            throw error;
        }
    }

    async unfollowUser(
        followerId: string,
        followingId: string,
    ): Promise<void> {
        const follow =
            await this.followsRepository.findByUsers(
                followerId,
                followingId,
            );

        if (!follow) return;

        await this.followsRepository.deleteById(follow.id);
    }
}