export interface OrdersRepository {
  findById(order_id: string): Promise<{ id: string; user_id: string; place_id: string } | null>;
  create(input: {
    user_id: string;
    place_id: string;
    total_amount: string;
    currency: string;
    payment_status: string;
    external_payment_id?: string;
    items: { menu_id: string; quantity: number; unit_price: string }[];
  }): Promise<{
    id: string;
    user_id: string;
    place_id: string;
    total_amount: string;
    currency: string;
    payment_status: string;
    external_payment_id: string | null;
    created_at: Date;
  }>;
  update(
    order_id: string,
    input: {
      payment_status?: string;
      external_payment_id?: string | null;
    },
  ): Promise<{
    id: string;
    user_id: string;
    place_id: string;
    total_amount: string;
    currency: string;
    payment_status: string;
    external_payment_id: string | null;
    created_at: Date;
  } | null>;
  findMany(query: { user_id?: string; place_id?: string }): Promise<
    {
      id: string;
      user_id: string;
      place_id: string;
      total_amount: string;
      currency: string;
      payment_status: string;
      external_payment_id: string | null;
      created_at: Date;
    }[]
  >;
}
