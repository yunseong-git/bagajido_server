export interface StoresRepository {
  createWithLngLat(input: {
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ id: string }>;
}
