import { Module } from '@nestjs/common';

import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { AuthService } from './services/auth.service';

// Jwt / Passport 토큰 로직을 직접 두지 않고, Auth는 Users에 의존하지 않는다. (순환 의존성 제거)
@Module({
    providers: [AuthService, SupabaseAuthGuard],
    exports: [AuthService, SupabaseAuthGuard],
})
export class AuthModule {}
