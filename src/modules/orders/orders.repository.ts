import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { OrdersRepository } from './orders.repository.interface';

@Injectable()
export class OrdersPrismaRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: {
    user_id: string;
    place_id: string;
    total_amount: string;
    currency: string;
    payment_status: string;
    external_payment_id?: string;
    items: { menu_id: string; quantity: number; unit_price: string }[];
  }) {
    const created = await this.prisma.order.create({
      data: {
        user_id: input.user_id,
        place_id: input.place_id,
        total_amount: new Prisma.Decimal(input.total_amount),
        currency: input.currency,
        payment_status: input.payment_status,
        external_payment_id: input.external_payment_id,
        items: {
          create: input.items.map((item) => ({
            menu_id: item.menu_id,
            quantity: item.quantity,
            unit_price: new Prisma.Decimal(item.unit_price),
          })),
        },
      },
      select: {
        id: true,
        user_id: true,
        place_id: true,
        total_amount: true,
        currency: true,
        payment_status: true,
        external_payment_id: true,
        created_at: true,
      },
    });
    return { ...created, total_amount: created.total_amount.toString() };
  }

  async update(
    order_id: string,
    input: { payment_status?: string; external_payment_id?: string | null },
  ) {
    const updated = await this.prisma.order.updateMany({
      where: { id: order_id },
      data: input,
    });
    if (updated.count === 0) {
      return null;
    }
    const row = await this.prisma.order.findUnique({
      where: { id: order_id },
      select: {
        id: true,
        user_id: true,
        place_id: true,
        total_amount: true,
        currency: true,
        payment_status: true,
        external_payment_id: true,
        created_at: true,
      },
    });
    return row ? { ...row, total_amount: row.total_amount.toString() } : null;
  }

  async findMany(query: { user_id?: string; place_id?: string }) {
    const rows = await this.prisma.order.findMany({
      where: { user_id: query.user_id, place_id: query.place_id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        user_id: true,
        place_id: true,
        total_amount: true,
        currency: true,
        payment_status: true,
        external_payment_id: true,
        created_at: true,
      },
    });
    return rows.map((row) => ({ ...row, total_amount: row.total_amount.toString() }));
  }

  async findById(order_id: string) {
    const row = await this.prisma.order.findUnique({
      where: { id: order_id },
      select: {
        id: true,
        user_id: true,
        place_id: true,
        total_amount: true,
        currency: true,
        payment_status: true,
        external_payment_id: true,
        created_at: true,
      },
    });
    return row ? { ...row, total_amount: row.total_amount.toString() } : null;
  }
}
