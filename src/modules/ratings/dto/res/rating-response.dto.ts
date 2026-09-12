import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RatingMetricDirection } from '@prisma/client';

export class RatingMetricResponseDto {
    @ApiProperty()
    metricDefinitionId!: string;

    @ApiProperty()
    key!: string;

    @ApiProperty()
    labelKo!: string;

    @ApiPropertyOptional({ nullable: true })
    labelEn!: string | null;

    @ApiProperty({
        enum: RatingMetricDirection,
    })
    direction!: RatingMetricDirection;

    @ApiProperty({
        minimum: 1,
        maximum: 5,
    })
    score!: number;
}

export class RatingResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    momentId!: string;

    @ApiProperty({
        minimum: 1,
        maximum: 5,
    })
    overallScore!: number;

    @ApiProperty({
        type: [RatingMetricResponseDto],
    })
    metrics!: RatingMetricResponseDto[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}