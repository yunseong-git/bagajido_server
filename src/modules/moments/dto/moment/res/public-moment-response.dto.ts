import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    MomentExperienceType,
    MomentVerificationType,
    RatingMetricDirection,
    VisitorType,
} from '@prisma/client';

export class PublicMomentUserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    username!: string;

    @ApiProperty()
    displayName!: string;

    @ApiPropertyOptional()
    profileImageKey!: string | null;
}

export class PublicMomentImageResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    imageUrl!: string;

    @ApiProperty()
    sortOrder!: number;

    @ApiPropertyOptional()
    width!: number | null;

    @ApiPropertyOptional()
    height!: number | null;
}

export class PublicMomentRatingMetricResponseDto {
    @ApiProperty()
    metricDefinitionId!: string;

    @ApiProperty()
    key!: string;

    @ApiProperty()
    labelKo!: string;

    @ApiPropertyOptional()
    labelEn!: string | null;

    @ApiProperty({
        enum: RatingMetricDirection,
    })
    direction!: RatingMetricDirection;

    @ApiProperty()
    score!: number;
}

export class PublicMomentRatingResponseDto {
    @ApiProperty()
    overallScore!: number;

    @ApiProperty({
        type: [PublicMomentRatingMetricResponseDto],
    })
    metrics!: PublicMomentRatingMetricResponseDto[];
}

export class PublicMomentResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    placeId!: string;

    @ApiProperty({
        type: PublicMomentUserResponseDto,
    })
    user!: PublicMomentUserResponseDto;

    @ApiProperty({
        example: '2026-09-11',
    })
    visitedOn!: string;

    @ApiProperty({
        enum: MomentExperienceType,
    })
    experienceType!: MomentExperienceType;

    @ApiProperty({
        enum: VisitorType,
    })
    visitorType!: VisitorType;

    @ApiProperty({
        enum: MomentVerificationType,
    })
    verificationType!: MomentVerificationType;

    @ApiPropertyOptional()
    content!: string | null;

    @ApiPropertyOptional()
    languageCode!: string | null;

    @ApiProperty()
    hasRating!: boolean;

    @ApiPropertyOptional({
        type: PublicMomentRatingResponseDto,
    })
    rating!: PublicMomentRatingResponseDto | null;

    @ApiProperty({
        type: [PublicMomentImageResponseDto],
    })
    images!: PublicMomentImageResponseDto[];

    @ApiProperty()
    likeCount!: number;

    @ApiProperty()
    likedByMe!: boolean;

    @ApiProperty()
    commentCount!: number;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}