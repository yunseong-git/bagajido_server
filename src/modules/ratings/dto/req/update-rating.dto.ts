import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';

import { RatingMetricInputDto } from './rating-metric-input.dto';

export class UpdateRatingDto {
    @ApiPropertyOptional({
        minimum: 1,
        maximum: 5,
        example: 3,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    overallScore?: number;

    @ApiPropertyOptional({
        type: [RatingMetricInputDto],
        description: '전달하면 기존 세부 Metric 전체를 이 값으로 교체합니다.',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingMetricInputDto)
    metrics?: RatingMetricInputDto[];
}