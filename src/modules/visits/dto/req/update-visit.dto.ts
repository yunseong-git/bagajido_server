import { ApiPropertyOptional } from '@nestjs/swagger';
import { VisitExperienceType, VisitorType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, Matches } from 'class-validator';

export class UpdateVisitDto {
    @ApiPropertyOptional({ example: '2026-09-10' })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    @IsDateString({ strict: true })
    visitedOn?: string;

    @ApiPropertyOptional({ example: '2026-09-10T15:00:00+09:00', nullable: true })
    @IsOptional()
    @IsDateString()
    visitedAt?: string | null;

    @ApiPropertyOptional({ enum: VisitExperienceType })
    @IsOptional()
    @IsEnum(VisitExperienceType)
    experienceType?: VisitExperienceType;

    @ApiPropertyOptional({ enum: VisitorType })
    @IsOptional()
    @IsEnum(VisitorType)
    visitorType?: VisitorType;
}
