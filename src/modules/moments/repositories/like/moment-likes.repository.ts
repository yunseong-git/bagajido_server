import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

import type { MomentLikesRepository } from './moment-likes.repository.interface';

@Injectable()
export class MomentLikesPrismaRepository implements MomentLikesRepository {
    constructor(private readonly prisma: PrismaService) { }

    findByUserIdAndMomentId(userId: string, momentId: string) {
        return this.prisma.momentLike.findUnique({
            where: {
                userId_momentId: {
                    userId,
                    momentId,
                },
            },
        });
    }

    async findLikedMomentIds(
        userId: string,
        momentIds: string[],
    ): Promise<string[]> {
        if (momentIds.length === 0) return [];

        const likes = await this.prisma.momentLike.findMany({
            where: {
                userId,
                momentId: {
                    in: momentIds,
                },
            },
            select: {
                momentId: true,
            },
        });

        return likes.map((like) => like.momentId);
    }

    create(userId: string, momentId: string) {
        return this.prisma.momentLike.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                moment: {
                    connect: {
                        id: momentId,
                    },
                },
            },
        });
    }

    async delete(
        userId: string,
        momentId: string,
    ): Promise<void> {
        await this.prisma.momentLike.delete({
            where: {
                userId_momentId: {
                    userId,
                    momentId,
                },
            },
        });
    }

    countByMomentId(momentId: string): Promise<number> {
        return this.prisma.momentLike.count({
            where: {
                momentId,
            },
        });
    }
}