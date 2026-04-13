import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiWebhookModule } from './modules/ai-webhook/ai-webhook.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrdersModule } from './modules/orders/orders.module';
import { QueueModule } from './modules/queue/queue.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StoreStatsModule } from './modules/store-stats/store-stats.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    QueueModule,
    UsersModule,
    StoresModule,
    MenusModule,
    OrdersModule,
    ReviewsModule,
    StoreStatsModule,
    AuthModule,
    AiWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
