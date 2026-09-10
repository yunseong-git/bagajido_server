import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { MomentExperienceType, MomentVisibility, VisitorType } from '@prisma/client';

export class CreateMomentDto {
    @ApiProperty({
        example: '2026-09-10',
        description: '실제 장소 방문 날짜',
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    @IsDateString({ strict: true })
    visitedOn!: string;

    @ApiPropertyOptional({
        example: '2026-09-10T14:30:00+09:00',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    visitedAt?: string | null;

    @ApiPropertyOptional({
        enum: MomentExperienceType,
        default: MomentExperienceType.VISIT_ONLY,
    })
    @IsOptional()
    @IsEnum(MomentExperienceType)
    experienceType?: MomentExperienceType;

    @ApiPropertyOptional({
        enum: VisitorType,
        default: VisitorType.UNKNOWN,
    })
    @IsOptional()
    @IsEnum(VisitorType)
    visitorType?: VisitorType;

    @ApiPropertyOptional({
        example: '평일 오전이라 비교적 한적해서 천천히 둘러보기 좋았어요.',
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    content?: string;

    @ApiPropertyOptional({
        example: 'ko-KR',
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    languageCode?: string;

    @ApiPropertyOptional({
        enum: MomentVisibility,
        default: MomentVisibility.PRIVATE,
    })
    @IsOptional()
    @IsEnum(MomentVisibility)
    visibility?: MomentVisibility;
}