import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET ??= 'x'.repeat(32);
    process.env.JWT_REFRESH_SECRET ??= 'y'.repeat(32);
    // Docker Compose 제거 후: Supabase URI를 쓰거나, 로컬 Postgres가 있으면 아래 기본값을 덮어쓰세요.
    process.env.DATABASE_URL ??=
      'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
    process.env.REDIS_URL ??= 'redis://127.0.0.1:6379';
    process.env.OAUTH2_AUTHORIZATION_URL ??=
      'https://example.com/oauth/authorize';
    process.env.OAUTH2_TOKEN_URL ??= 'https://example.com/oauth/token';
    process.env.OAUTH2_CLIENT_ID ??= 'e2e_client';
    process.env.OAUTH2_CLIENT_SECRET ??= 'e2e_secret';
    process.env.OAUTH2_CALLBACK_URL ??=
      'http://127.0.0.1:3000/auth/oauth2/callback';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
