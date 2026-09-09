import type { Request } from 'express';

//authUserId는 곧 Supabase JWT의 sub
export interface AuthUser { 
  authUserId: string;
  email: string | null;
}

export type SupabaseAuthenticatedRequest = Request & {
  authUser: AuthUser;
};