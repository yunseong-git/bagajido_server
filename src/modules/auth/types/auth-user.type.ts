import type { Request } from 'express';

export interface AuthUser {
    // authUserId는 곧 Supabase JWT의 sub
    authUserId: string;
    email: string | null;
}

export type SupabaseAuthenticatedRequest = Request & {
    authUser: AuthUser;
};
