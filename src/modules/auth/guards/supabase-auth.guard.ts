import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import type { SupabaseAuthenticatedRequest } from '../types/auth-user.type';

// 이 Guard에서는 Bagajido DB의 User 존재 여부를 검사하지 않고 Supabase JWT 유효성만 검사한다.
// 신규 가입자는 Supabase User는 있고 Bagajido User는 없는 상태가 반드시 존재해야 하기 때문.
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<SupabaseAuthenticatedRequest>();

        request.authUser = await this.authService.authenticateAuthorizationHeader(
            request.headers.authorization,
        );

        return true;
    }
}
