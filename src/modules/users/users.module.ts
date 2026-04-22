import { Module } from '@nestjs/common';
import { UsersPrismaRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [StoresModule],
  providers: [UsersPrismaRepository, UsersService],
  exports: [UsersService, UsersPrismaRepository],
  controllers: [UsersController],
})
export class UsersModule {}
