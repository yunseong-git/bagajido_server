/**내부/내 Moment 조회용 */
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