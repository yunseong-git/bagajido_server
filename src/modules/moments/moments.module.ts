import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PlacesModule } from '../places/places.module';
import { UsersModule } from '../users/users.module';

import { MomentsController } from './controllers/moments.controller';
import { PlaceMomentsController } from './controllers/place-moments.controller';

import { MomentsPrismaRepository } from './moments.repository';

import { MomentsCommandService } from './services/moments-command.service';
import { MomentsQueryService } from './services/moments-query.service';

@Module({
    imports: [AuthModule, UsersModule, PlacesModule],
    controllers: [MomentsController, PlaceMomentsController],
    providers: [
        MomentsPrismaRepository,
        MomentsQueryService,
        MomentsCommandService,
    ],
})
export class MomentsModule {}