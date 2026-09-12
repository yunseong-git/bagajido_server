import { Prisma } from '@prisma/client';

export const momentCommentWithUserInclude = {
    user: {
        select: {
            id: true,
            username: true,
            displayName: true,
            profileImageKey: true,
        },
    },
} satisfies Prisma.MomentCommentInclude;

export type MomentCommentWithUser = Prisma.MomentCommentGetPayload<{
    include: typeof momentCommentWithUserInclude;
}>;