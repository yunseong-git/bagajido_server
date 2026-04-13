import { Injectable } from '@nestjs/common';
import { OrdersPrismaRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersPrismaRepository) {}
}
