//Visit, Rating, Comment, Moment, Wiki, Follow, Record에서 반복해서 사용될 핵심가드
import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  
  import { AuthService } from '../../auth/services/auth.service';
  
  import type { RegisteredUserRequest } from '../types/current-user.type';
  import { UsersService } from '../users.service';
  
  @Injectable()
  export class RegisteredUserGuard
    implements CanActivate
  {
    constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService,
    ) {}
  
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      const request =
        context
          .switchToHttp()
          .getRequest<RegisteredUserRequest>();
  
      const authUser =
        await this.authService
          .authenticateAuthorizationHeader(
            request.headers.authorization,
          );
  
      const currentUser =
        await this.usersService.getCurrentUser(
          authUser.authUserId,
        );
  
      request.authUser = authUser;
      request.currentUser = currentUser;
  
      return true;
    }
  }