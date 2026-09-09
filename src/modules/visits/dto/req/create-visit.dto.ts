//verificationType, verifiedAt, userId(accessToken에서 가져옴), placeId(URL에서 가져옴) 등은 없음
import { ApiProperty, ApiPropertyOptional, } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsOptional, Matches, } from 'class-validator';

import { VisitExperienceType, VisitorType, } from '@prisma/client';

export class CreateVisitDto {
    @ApiProperty({ example: '2026-09-09', description: '방문 기준 날짜 YYYY-MM-DD', })
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    @IsDateString({ strict: true, })
    visitedOn!: string;

    @ApiPropertyOptional({ example: '2026-09-09T14:30:00+09:00', nullable: true, })
    @IsOptional()
    @IsDateString()
    visitedAt?: string | null;

    @ApiPropertyOptional({
        enum: VisitExperienceType,
        default: VisitExperienceType.VISIT_ONLY,
    })
    @IsOptional()
    @IsEnum(VisitExperienceType)
    experienceType?: VisitExperienceType;

    @ApiPropertyOptional({
        enum: VisitorType,
        default: VisitorType.UNKNOWN,
    })
    @IsOptional()
    @IsEnum(VisitorType)
    visitorType?: VisitorType;
}