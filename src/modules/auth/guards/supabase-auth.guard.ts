// 이 Guard에서는 Bagajido DB의 User 존재 여부를 검사하지 않음
// 오직 Supabase JWT의 유효성 검사만 수행
// 이유? 신규가입자는 Supabase User 있음, Bagajido User 없음 상태가 반드시 존재해야함
import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  
  import { AuthService } from '../services/auth.service';
  import type { SupabaseAuthenticatedRequest } from '../types/auth-user.type';
  
  @Injectable()
  export class SupabaseAuthGuard implements CanActivate {
    constructor(
      private readonly authService: AuthService,
    ) {}
  
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      const request =
        context
          .switchToHttp()
          .getRequest<SupabaseAuthenticatedRequest>();
  
      request.authUser =
        await this.authService.authenticateAuthorizationHeader(
          request.headers.authorization,
        );
  
      return true;
    }
  }