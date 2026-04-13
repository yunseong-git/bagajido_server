import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL', 'redis://127.0.0.1:6379');
        return new Redis(url, { maxRetriesPerRequest: null });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
