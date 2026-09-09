import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RegisteredUserGuard } from './guards/registered-user.guard';
import { RolesGuard } from './guards/roles.guard';

import { UsersController } from './users.controller';
import { UsersPrismaRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UsersPrismaRepository,
    UsersService,
    RegisteredUserGuard,
    RolesGuard,
  ],

  exports: [
    UsersPrismaRepository,
    UsersService,
    RegisteredUserGuard,
    RolesGuard,
  ],
})
export class UsersModule {}