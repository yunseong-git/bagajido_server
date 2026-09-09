import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'yunseong', minLength: 3, maxLength: 30 })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-z0-9_]+$/)
    username?: string;

    @ApiPropertyOptional({ example: '윤성', maxLength: 50 })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    displayName?: string;

    @ApiPropertyOptional({ example: '여행 기록 중', nullable: true, maxLength: 500 })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(500)
    bio?: string | null;

    @ApiPropertyOptional({ example: 'KR', nullable: true })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @Matches(/^[A-Z]{2}$/)
    nationalityCode?: string | null;

    @ApiPropertyOptional({ example: 'KR', nullable: true })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @Matches(/^[A-Z]{2}$/)
    residenceCountryCode?: string | null;

    @ApiPropertyOptional({ example: 'en-US' })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    @Matches(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/)
    preferredLocale?: string;
}
