import { Prisma } from '@prisma/client';

export const visitInclude = {
    place: {
        select: {
            id: true,
            name: true,
            address: true,
            status: true,

            category: {
                select: { id: true, key: true, nameKo: true, nameEn: true },
            },
        },
    },

    rating: {
        select: { id: true },
    },
} satisfies Prisma.PlaceVisitInclude;

export type VisitWithRelations = Prisma.PlaceVisitGetPayload<{
    include: typeof visitInclude;
}>;
