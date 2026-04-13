import { Module } from '@nestjs/common';
import { StoreStatsController } from './store-stats.controller';
import { StoreStatsPrismaRepository } from './store-stats.repository';
import { StoreStatsService } from './store-stats.service';

@Module({
  controllers: [StoreStatsController],
  providers: [StoreStatsPrismaRepository, StoreStatsService],
  exports: [StoreStatsService, StoreStatsPrismaRepository],
})
export class StoreStatsModule {}
