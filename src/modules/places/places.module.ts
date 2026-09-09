import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

import { AdminPlacesController } from './controllers/admin-places.controller';
import { PlacesController } from './controllers/places.controller';

import { PlacesPrismaRepository } from './places.repository';

import { PlacesCommandService } from './services/places-command.service';
import { PlacesQueryService } from './services/places-query.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
  ],

  controllers: [
    PlacesController,
    AdminPlacesController,
  ],

  providers: [
    PlacesPrismaRepository,
    PlacesQueryService,
    PlacesCommandService,
  ],

  exports: [
    PlacesPrismaRepository,
    PlacesQueryService,
    PlacesCommandService,
  ],
})
export class PlacesModule { }