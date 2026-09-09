import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PlacesModule } from '../places/places.module';
import { UsersModule } from '../users/users.module';

import { PlaceVisitsController } from './controllers/place-visits.controller';
import { VisitsController } from './controllers/visits.controller';

import { VisitsCommandService } from './services/visits-command.service';
import { VisitsQueryService } from './services/visits-query.service';

import { VisitsPrismaRepository } from './visits.repository';

@Module({
    imports: [AuthModule, UsersModule, PlacesModule],
    controllers: [PlaceVisitsController, VisitsController],
    providers: [VisitsPrismaRepository, VisitsQueryService, VisitsCommandService],
    exports: [VisitsPrismaRepository, VisitsQueryService, VisitsCommandService],
})
export class VisitsModule {}
