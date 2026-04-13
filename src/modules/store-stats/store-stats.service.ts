import { Injectable } from '@nestjs/common';
import { StoreStatsPrismaRepository } from './store-stats.repository';

@Injectable()
export class StoreStatsService {
  constructor(private readonly storeStatsRepository: StoreStatsPrismaRepository) {}
}
