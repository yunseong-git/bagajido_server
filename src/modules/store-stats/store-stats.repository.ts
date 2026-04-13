import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StoreStatsRepository } from './store-stats.repository.interface';

@Injectable()
export class StoreStatsPrismaRepository implements StoreStatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async touchStore(store_id: string): Promise<void> {
    await this.prisma.storeStat.upsert({
      where: { store_id },
      create: { store_id },
      update: {},
    });
  }
}
