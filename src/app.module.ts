import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiWebhookModule } from './modules/ai-webhook/ai-webhook.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    StoresModule,
    MenusModule,
    OrdersModule,
    ReviewsModule,
    AuthModule,
    AiWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
