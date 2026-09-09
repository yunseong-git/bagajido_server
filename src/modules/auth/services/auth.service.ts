import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import type { AuthUser } from '../types/auth-user.type';

@Injectable()
export class AuthService {
    private readonly supabase: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
        const supabasePublishableKey = this.configService.getOrThrow<string>(
            'SUPABASE_PUBLISHABLE_KEY',
        );

        // 세션의 주인은 Nest가 아니라 Supabase이므로
        // autoRefreshToken / persistSession / detectSessionInUrl은 꺼둔다.
        this.supabase = createClient(supabaseUrl, supabasePublishableKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        });
    }

    async authenticateAuthorizationHeader(authorization?: string): Promise<AuthUser> {
        const accessToken = this.extractBearerToken(authorization);

        return this.verifyAccessToken(accessToken);
    }

    async verifyAccessToken(accessToken: string): Promise<AuthUser> {
        try {
            const { data, error } = await this.supabase.auth.getClaims(accessToken);

            if (error || !data?.claims?.sub) {
                throw new UnauthorizedException('INVALID_ACCESS_TOKEN');
            }

            const email = typeof data.claims.email === 'string' ? data.claims.email : null;

            return { authUserId: data.claims.sub, email };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;

            throw new UnauthorizedException('INVALID_ACCESS_TOKEN');
        }
    }

    private extractBearerToken(authorization?: string): string {
        if (!authorization) throw new UnauthorizedException('ACCESS_TOKEN_REQUIRED');

        const [scheme, token] = authorization.trim().split(/\s+/);

        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            throw new UnauthorizedException('INVALID_AUTHORIZATION_HEADER');
        }

        return token;
    }
}
