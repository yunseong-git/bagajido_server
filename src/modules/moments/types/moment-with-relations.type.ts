import { Prisma } from '@prisma/client';

export const momentWithRelationsInclude = {
    place: {
        include: {
            category: true,
        },
    },
    rating: {
        select: {
            id: true,
        },
    },
} satisfies Prisma.MomentInclude;

export type MomentWithRelations = Prisma.MomentGetPayload<{
    include: typeof momentWithRelationsInclude;
}>;

export const publicMomentInclude = {
    user: {
        select: {
            id: true,
            username: true,
            displayName: true,
            profileImageKey: true,
        },
    },
    rating: {
        select: {
            id: true,
        },
    },
} satisfies Prisma.MomentInclude;

export type PublicMomentWithRelations = Prisma.MomentGetPayload<{
    include: typeof publicMomentInclude;
}>;