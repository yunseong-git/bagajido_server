import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersPrismaRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersPrismaRepository, OrdersService],
  exports: [OrdersService, OrdersPrismaRepository],
})
export class OrdersModule {}
