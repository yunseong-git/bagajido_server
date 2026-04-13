export interface StoreStatsRepository {
  touchStore(store_id: string): Promise<void>;
}
