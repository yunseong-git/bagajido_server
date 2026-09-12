import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RatingMetricDirection } from '@prisma/client';

export class PlaceRatingMetricOptionDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    key!: string;

    @ApiProperty()
    labelKo!: string;

    @ApiPropertyOptional({ nullable: true })
    labelEn!: string | null;

    @ApiPropertyOptional({ nullable: true })
    description!: string | null;

    @ApiProperty({
        enum: RatingMetricDirection,
    })
    direction!: RatingMetricDirection;

    @ApiProperty()
    isRequired!: boolean;

    @ApiProperty()
    sortOrder!: number;
}

export class PlaceRatingMetricsResponseDto {
    @ApiProperty()
    placeId!: string;

    @ApiPropertyOptional({
        nullable: true,
        description: 'Place에 Category가 없으면 null입니다.',
    })
    categoryId!: string | null;

    @ApiProperty({
        type: [PlaceRatingMetricOptionDto],
    })
    metrics!: PlaceRatingMetricOptionDto[];
}