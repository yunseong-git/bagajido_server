export interface MenusRepository {
  findById(menu_id: string): Promise<{ id: string; store_id: string } | null>;
  create(input: {
    store_id: string;
    name: string;
    reference_image_url: string;
    portion_grams?: number;
  }): Promise<{
    id: string;
    store_id: string;
    name: string;
    reference_image_url: string;
    portion_grams: number | null;
    created_at: Date;
    updated_at: Date;
  }>;
  update(
    menu_id: string,
    input: {
      name?: string;
      reference_image_url?: string;
      portion_grams?: number | null;
    },
  ): Promise<{
    id: string;
    store_id: string;
    name: string;
    reference_image_url: string;
    portion_grams: number | null;
    created_at: Date;
    updated_at: Date;
  } | null>;
  findMany(query: { store_id?: string }): Promise<
    {
      id: string;
      store_id: string;
      name: string;
      reference_image_url: string;
      portion_grams: number | null;
      created_at: Date;
      updated_at: Date;
    }[]
  >;
}
