import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

// authUserId는 API 응답에 노출하지 않는다.
// Supabase auth.users.id는 내부 Auth 연결 키일 뿐 사용자 프로필 식별자가 아님.
export class UserResponseDto {
    @ApiProperty({ format: 'uuid' })
    id!: string;

    @ApiProperty({ example: 'yunseong' })
    username!: string;

    @ApiProperty({ example: '윤성' })
    displayName!: string;

    @ApiPropertyOptional({ nullable: true })
    bio!: string | null;

    @ApiPropertyOptional({ nullable: true })
    profileImageKey!: string | null;

    @ApiPropertyOptional({ example: 'KR', nullable: true })
    nationalityCode!: string | null;

    @ApiPropertyOptional({ example: 'KR', nullable: true })
    residenceCountryCode!: string | null;

    @ApiProperty({ example: 'ko-KR' })
    preferredLocale!: string;

    @ApiProperty({ enum: UserRole })
    role!: UserRole;

    @ApiProperty({ enum: UserStatus })
    status!: UserStatus;

    @ApiPropertyOptional({ nullable: true })
    withdrawnAt!: Date | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
