import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { RegisteredUserGuard } from './guards/registered-user.guard';
import { RolesGuard } from './guards/roles.guard';

import { UsersController } from './controllers/users.controller';
import { PublicUsersController } from './controllers/public-users.controller';

import { UsersPrismaRepository } from './repositories/users.repository';
import { UserProfilesPrismaRepository } from './repositories/user-profiles.repository';

import { UsersService } from './services/users.service';
import { UsersPublicQueryService } from './services/users-public-query.service';

@Module({
    imports: [AuthModule],
    controllers: [
        UsersController,
        PublicUsersController
    ],
    providers: [
        UsersPrismaRepository,
        UsersService,
        RegisteredUserGuard,
        RolesGuard,
        UserProfilesPrismaRepository,
        UsersPublicQueryService,
    ],
    exports: [
        UsersPrismaRepository,
        UsersService,
        RegisteredUserGuard,
        RolesGuard],
})
export class UsersModule { }
