import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Observable, firstValueFrom } from 'rxjs';
import { REQUIRE_OWNER_KEY } from '../decorators/require-owner.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRole } from '../types/user-role.type';

type RequestWithAuthContext = Request & {
  user?: { oauth_subject?: string };
  owner?: unknown;
  userEntity?: unknown;
};

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const baseResult = super.canActivate(context);
    const baseAllowed = await this.resolveCanActivate(baseResult);

    if (!baseAllowed) {
      return false;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const oauthSubject = request.user?.oauth_subject;

    if (!oauthSubject) {
      throw new UnauthorizedException('Missing oauth_subject in JWT payload');
    }

    const requireOwner = this.reflector.getAllAndOverride<boolean>(REQUIRE_OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requireOwner) {
      const owner = await this.prisma.owner.findFirst({
        where: { oauth_subject: oauthSubject },
      });

      if (!owner) {
        throw new ForbiddenException('Owner account is required for this endpoint');
      }

      request.owner = owner;
    }

    if (roles && roles.length > 0) {
      const userEntity = await this.prisma.user.findFirst({
        where: { oauth_subject: oauthSubject },
      });

      if (!userEntity || !roles.includes(userEntity.role)) {
        throw new ForbiddenException('Insufficient role for this endpoint');
      }

      request.userEntity = userEntity;
    }

    return true;
  }

  private resolveCanActivate(
    result: boolean | Promise<boolean> | Observable<boolean>,
  ): Promise<boolean> {
    if (result instanceof Promise) {
      return result;
    }

    if (result instanceof Observable) {
      return firstValueFrom(result);
    }

    return Promise.resolve(result);
  }
}
