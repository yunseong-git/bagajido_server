export interface StoresRepository {
  createWithLngLat(input: {
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ id: string }>;
  findWithinBounds(bounds: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }): Promise<unknown[]>;
  findMapItems(bounds: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    zoom: number;
  }): Promise<unknown[]>;
  addLike(user_id: string, store_id: string): Promise<void>;
  removeLike(user_id: string, store_id: string): Promise<void>;
  findLikedStores(user_id: string): Promise<unknown[]>;
  addPick(user_id: string, store_id: string): Promise<void>;
  removePick(user_id: string, store_id: string): Promise<void>;
  findPickedStores(user_id: string): Promise<unknown[]>;
}
