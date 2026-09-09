/**
 * @CurrentAuthUser() → Supabase 인증 정보
 * @CurrentUserEntity() → Bagajido User 정보
 * 로 구분함.
 */
import {
    createParamDecorator,
    ExecutionContext,
  } from '@nestjs/common';
  
  import type {
    CurrentUser,
    RegisteredUserRequest,
  } from '../types/current-user.type';
  
  export const CurrentUserEntity =
    createParamDecorator(
      (
        _data: unknown,
        context: ExecutionContext,
      ): CurrentUser => {
        const request =
          context
            .switchToHttp()
            .getRequest<RegisteredUserRequest>();
  
        return request.currentUser;
      },
    );