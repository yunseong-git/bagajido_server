//사용예시: @CurrentAuthUser() authUser: AuthUser
import {
    createParamDecorator,
    ExecutionContext,
  } from '@nestjs/common';
  
  import type {
    AuthUser,
    SupabaseAuthenticatedRequest,
  } from '../types/auth-user.type';
  
  export const CurrentAuthUser = createParamDecorator(
    (
      _data: unknown,
      context: ExecutionContext,
    ): AuthUser => {
      const request =
        context
          .switchToHttp()
          .getRequest<SupabaseAuthenticatedRequest>();
  
      return request.authUser;
    },
  );