import { UserRole, UserStatus } from '@prisma/client';
import type { Request } from 'express';

import type { AuthUser, SupabaseAuthenticatedRequest } from '../../auth/types/auth-user.type';

/**
 * AuthUser = Supabase가 인증한 사람
 * CurrentUser = Bagajido 가입까지 완료한 사람
 */
export interface CurrentUser {
    id: string;
    username: string;
    role: UserRole;
    status: UserStatus;
}

export type RegisteredUserRequest = SupabaseAuthenticatedRequest & {
    authUser: AuthUser;
    currentUser: CurrentUser;
};
