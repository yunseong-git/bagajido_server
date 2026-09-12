import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Matches, Max, Min } from 'class-validator';

export class GetMyMomentsDto {
    @ApiPropertyOptional({
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID()
    placeId?: string;

    @ApiPropertyOptional({
        example: '2026-09-01',
    })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    from?: string;

    @ApiPropertyOptional({
        example: '2026-09-30',
    })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    to?: string;

    @ApiPropertyOptional({
        default: 1,
        minimum: 1,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        default: 20,
        minimum: 1,
        maximum: 100,
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;
}