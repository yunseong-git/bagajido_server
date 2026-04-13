import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { OrdersRepository } from './orders.repository.interface';

@Injectable()
export class OrdersPrismaRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(order_id: string) {
    return this.prisma.order.findUnique({
      where: { id: order_id },
      select: { id: true, user_id: true, store_id: true },
    });
  }
}
