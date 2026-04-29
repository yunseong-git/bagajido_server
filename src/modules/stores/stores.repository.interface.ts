export interface StoresRepository {
  createWithLngLat(input: {
    place_id: string;
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ place_id: string }>;
  addLike(user_id: string, place_id: string): Promise<void>;
  removeLike(user_id: string, place_id: string): Promise<void>;
  findLikedStores(user_id: string): Promise<unknown[]>;
  addPick(user_id: string, place_id: string): Promise<void>;
  removePick(user_id: string, place_id: string): Promise<void>;
  findPickedStores(user_id: string): Promise<unknown[]>;
  findMetricsByPlaceIds(place_ids: string[]): Promise<
    {
      place_id: string;
      name: string;
      avg_value_score: number | null;
      review_count: number;
      like_count: number;
      pick_count: number;
      ai_summary_line: string | null;
    }[]
  >;
}
