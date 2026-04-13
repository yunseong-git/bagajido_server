import { Module } from '@nestjs/common';
import { UsersPrismaRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [UsersPrismaRepository, UsersService],
  exports: [UsersService, UsersPrismaRepository],
})
export class UsersModule {}
