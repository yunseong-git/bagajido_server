import { MomentCommentStatus, Prisma } from '@prisma/client';

export const publicMomentWithRelationsInclude = {
    user: {
        select: {
            id: true,
            username: true,
            displayName: true,
            profileImageKey: true,
        },
    },
    rating: {
        include: {
            metrics: {
                include: {
                    metricDefinition: true,
                },
            },
        },
    },
    images: {
        orderBy: [
            {
                sortOrder: 'asc' as const,
            },
            {
                createdAt: 'asc' as const,
            },
        ],
    },
    _count: {
        select: {
            likes: true,
            comments: {
                where: {
                    status: MomentCommentStatus.ACTIVE,
                },
            },
        },
    },
} satisfies Prisma.MomentInclude;

export type PublicMomentWithRelations = Prisma.MomentGetPayload<{
    include: typeof publicMomentWithRelationsInclude;
}>;