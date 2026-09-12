import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class RatingMetricInputDto {
    @ApiProperty({
        format: 'uuid',
    })
    @IsUUID()
    metricDefinitionId!: string;

    @ApiProperty({
        minimum: 1,
        maximum: 5,
        example: 4,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;
}