import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { MomentExperienceType, MomentVisibility, VisitorType } from '@prisma/client';

export class UpdateMomentDto {
    @ApiPropertyOptional({
        example: '2026-09-10',
    })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    @IsDateString({ strict: true })
    visitedOn?: string;

    @ApiPropertyOptional({
        example: '2026-09-10T15:00:00+09:00',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    visitedAt?: string | null;

    @ApiPropertyOptional({
        enum: MomentExperienceType,
    })
    @IsOptional()
    @IsEnum(MomentExperienceType)
    experienceType?: MomentExperienceType;

    @ApiPropertyOptional({
        enum: VisitorType,
    })
    @IsOptional()
    @IsEnum(VisitorType)
    visitorType?: VisitorType;

    @ApiPropertyOptional({
        example: '내용을 수정합니다.',
        nullable: true,
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    content?: string | null;

    @ApiPropertyOptional({
        example: 'ko-KR',
        nullable: true,
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    languageCode?: string | null;

    @ApiPropertyOptional({
        enum: MomentVisibility,
    })
    @IsOptional()
    @IsEnum(MomentVisibility)
    visibility?: MomentVisibility;
}