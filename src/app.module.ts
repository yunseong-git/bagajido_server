import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PlacesModule } from './modules/places/places.module';
import { MomentsModule } from './modules/moments/moments.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { StorageModule } from './modules/storage/storage.module';
import { FollowsModule } from './modules/follows/follows.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        PrismaModule,

        AuthModule,
        UsersModule,
        PlacesModule,
        MomentsModule,
        RatingsModule,
        StorageModule,
        FollowsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
