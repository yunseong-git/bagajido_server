import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { StoresPrismaRepository } from './stores.repository';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoreMapQueryDto } from './dto/find-store-map-query.dto';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresPrismaRepository) {}

  async createWithLngLat(dto: CreateStoreDto) {
    return await this.storesRepository.createWithLngLat(dto);
  }

  async findWithinBounds(bounds: { xmin: number; ymin: number; xmax: number; ymax: number }) {
    return await this.storesRepository.findWithinBounds(bounds);
  }

  async findMapItems(query: FindStoreMapQueryDto) {
    return this.storesRepository.findMapItems(query);
  }

  async findAll() {
    return await this.storesRepository.findAll();
  }
  
  async findOne(id: string) {
    return await this.storesRepository.findById(id);
  }
  
  async searchByName(name: string) {
    return await this.storesRepository.findByName(name);
  }

  async likeStore(user_id: string, store_id: string) {
    const store = await this.storesRepository.findById(store_id);
    if (!store) {
      throw new NotFoundException('store_not_found');
    }
    try {
      await this.storesRepository.addLike(user_id, store_id);
      return { liked: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('store_like_already_exists');
      }
      throw error;
    }
  }

  async unlikeStore(user_id: string, store_id: string) {
    await this.storesRepository.removeLike(user_id, store_id);
    return { liked: false };
  }

  async findMyLikedStores(user_id: string) {
    return this.storesRepository.findLikedStores(user_id);
  }

  async pickStore(user_id: string, store_id: string) {
    const store = await this.storesRepository.findById(store_id);
    if (!store) {
      throw new NotFoundException('store_not_found');
    }
    try {
      await this.storesRepository.addPick(user_id, store_id);
      return { picked: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('store_pick_already_exists');
      }
      throw error;
    }
  }

  async unpickStore(user_id: string, store_id: string) {
    await this.storesRepository.removePick(user_id, store_id);
    return { picked: false };
  }

  async findMyPickedStores(user_id: string) {
    return this.storesRepository.findPickedStores(user_id);
  }
}
