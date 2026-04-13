export interface OrdersRepository {
  findById(order_id: string): Promise<{ id: string; user_id: string; store_id: string } | null>;
}
