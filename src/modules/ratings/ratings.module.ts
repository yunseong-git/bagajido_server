import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MomentsModule } from '../moments/moments.module';
import { PlacesModule } from '../places/places.module';
import { UsersModule } from '../users/users.module';

import { MomentRatingsController } from './controllers/moment-ratings.controller';
import { PlaceRatingMetricsController } from './controllers/place-rating-metrics.controller';

import { RatingsPrismaRepository } from './ratings.repository';

import { RatingsCommandService } from './services/ratings-command.service';
import { RatingsQueryService } from './services/ratings-query.service';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        PlacesModule,
        MomentsModule,
    ],
    controllers: [
        MomentRatingsController,
        PlaceRatingMetricsController,
    ],
    providers: [
        RatingsPrismaRepository,
        RatingsQueryService,
        RatingsCommandService,
    ],
})
export class RatingsModule {}