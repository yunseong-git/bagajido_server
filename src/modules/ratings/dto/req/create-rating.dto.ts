import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';

import { RatingMetricInputDto } from './rating-metric-input.dto';

export class CreateRatingDto {
    @ApiProperty({
        minimum: 1,
        maximum: 5,
        example: 4,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    overallScore!: number;

    @ApiPropertyOptional({
        type: [RatingMetricInputDto],
        default: [],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingMetricInputDto)
    metrics?: RatingMetricInputDto[];
}