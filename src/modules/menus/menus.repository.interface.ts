export interface MenusRepository {
  findById(menu_id: string): Promise<{ id: string; place_id: string } | null>;
  create(input: {
    place_id: string;
    name: string;
    reference_image_url: string;
    portion_grams?: number;
  }): Promise<{
    id: string;
    place_id: string;
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
    place_id: string;
    name: string;
    reference_image_url: string;
    portion_grams: number | null;
    created_at: Date;
    updated_at: Date;
  } | null>;
  findMany(query: { place_id?: string }): Promise<
    {
      id: string;
      place_id: string;
      name: string;
      reference_image_url: string;
      portion_grams: number | null;
      created_at: Date;
      updated_at: Date;
    }[]
  >;
}
