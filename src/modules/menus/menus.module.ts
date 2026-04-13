import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusPrismaRepository } from './menus.repository';
import { MenusService } from './menus.service';

@Module({
  controllers: [MenusController],
  providers: [MenusPrismaRepository, MenusService],
  exports: [MenusService, MenusPrismaRepository],
})
export class MenusModule {}
