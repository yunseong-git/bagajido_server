import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresPrismaRepository } from './stores.repository';
import { StoresService } from './stores.service';

@Module({
  controllers: [StoresController],
  providers: [StoresPrismaRepository, StoresService],
  exports: [StoresService, StoresPrismaRepository],
})
export class StoresModule {}
