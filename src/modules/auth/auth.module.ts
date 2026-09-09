import { Module } from '@nestjs/common';

import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { AuthService } from './services/auth.service';

//Jwt나 Passport랑 토큰로직 같은거 깔끔하게 제거, Auth → Users 의존성없음, 따라서 순환의존성 제거
@Module({
  providers: [
    AuthService,
    SupabaseAuthGuard,
  ],
  exports: [
    AuthService,
    SupabaseAuthGuard,
  ],
})
export class AuthModule {}