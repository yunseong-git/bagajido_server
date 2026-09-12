import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MomentsQueryService } from './moments-query.service';
import { MomentLikesPrismaRepository } from '../repositories/like/moment-likes.repository';

@Injectable()
export class MomentLikesService {
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly momentLikesRepository: MomentLikesPrismaRepository,
    ) {}

    async likeMoment(
        userId: string,
        momentId: string,
    ): Promise<void> {
        await this.momentsQueryService.getPublicActiveMoment(momentId);

        const existingLike =
            await this.momentLikesRepository.findByUserIdAndMomentId(
                userId,
                momentId,
            );

        if (existingLike) {
            throw new ConflictException('MOMENT_ALREADY_LIKED');
        }

        try {
            await this.momentLikesRepository.create(userId, momentId);
        } catch (error) {
            const isUniqueError =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002';

            if (isUniqueError) {
                throw new ConflictException('MOMENT_ALREADY_LIKED');
            }

            throw error;
        }
    }

    async unlikeMoment(
        userId: string,
        momentId: string,
    ): Promise<void> {
        const existingLike =
            await this.momentLikesRepository.findByUserIdAndMomentId(
                userId,
                momentId,
            );

        if (!existingLike) return;

        await this.momentLikesRepository.delete(userId, momentId);
    }
}