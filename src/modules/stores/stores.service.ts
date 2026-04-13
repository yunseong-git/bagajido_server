import { Injectable } from '@nestjs/common';
import { StoresPrismaRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresPrismaRepository) {}

  createWithLngLat(input: {
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }) {
    return this.storesRepository.createWithLngLat(input);
  }
}
