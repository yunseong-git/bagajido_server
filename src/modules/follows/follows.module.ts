import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { FollowsController } from './controllers/follows.controller';
import { FollowsQueryController } from './controllers/follows-query.controller';

import { FollowsPrismaRepository } from './repositories/follows.repository';

import { FollowsCommandService } from './services/follows-command.service';
import { FollowsQueryService } from './services/follows-query.service';

@Module({
    imports: [
        AuthModule,
        UsersModule,
    ],
    controllers: [
        FollowsController,
        FollowsQueryController,
    ],
    providers: [
        FollowsPrismaRepository,
        FollowsCommandService,
        FollowsQueryService,
    ],
    exports: [
        FollowsQueryService,
    ],
})
export class FollowsModule {}