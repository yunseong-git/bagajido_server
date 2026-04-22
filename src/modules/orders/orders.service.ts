import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersPrismaRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrderQueryDto } from './dto/find-order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersPrismaRepository) {}

  create(user_id: string, input: CreateOrderDto) {
    return this.ordersRepository.create({
      user_id,
      store_id: input.store_id,
      total_amount: input.total_amount.toFixed(2),
      currency: input.currency,
      payment_status: input.payment_status,
      external_payment_id: input.external_payment_id,
      items: input.items.map((item) => ({
        menu_id: item.menu_id,
        quantity: item.quantity,
        unit_price: item.unit_price.toFixed(2),
      })),
    });
  }

  async update(order_id: string, input: UpdateOrderDto) {
    const order = await this.ordersRepository.update(order_id, input);
    if (!order) {
      throw new NotFoundException('order_not_found');
    }
    return order;
  }

  async findOne(order_id: string) {
    const order = await this.ordersRepository.findById(order_id);
    if (!order) {
      throw new NotFoundException('order_not_found');
    }
    return order;
  }

  findMany(query: FindOrderQueryDto) {
    return this.ordersRepository.findMany(query);
  }
}
