export interface MenusRepository {
  findById(menu_id: string): Promise<{ id: string; store_id: string } | null>;
}
