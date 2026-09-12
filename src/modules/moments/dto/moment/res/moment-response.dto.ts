import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    MomentExperienceType,
    MomentStatus,
    MomentVerificationType,
    MomentVisibility,
    VisitorType,
} from '@prisma/client';

export class MomentCategoryResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    key!: string;

    @ApiProperty()
    nameKo!: string;

    @ApiPropertyOptional({ nullable: true })
    nameEn!: string | null;
}

export class MomentPlaceResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional({
        type: MomentCategoryResponseDto,
        nullable: true,
    })
    category!: MomentCategoryResponseDto | null;
}

export class MomentResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({ type: MomentPlaceResponseDto })
    place!: MomentPlaceResponseDto;

    @ApiProperty({ example: '2026-09-10' })
    visitedOn!: string;

    @ApiPropertyOptional({ nullable: true })
    visitedAt!: Date | null;

    @ApiProperty({ enum: MomentExperienceType })
    experienceType!: MomentExperienceType;

    @ApiProperty({ enum: VisitorType })
    visitorType!: VisitorType;

    @ApiProperty({ enum: MomentVerificationType })
    verificationType!: MomentVerificationType;

    @ApiPropertyOptional({ nullable: true })
    verifiedAt!: Date | null;

    @ApiPropertyOptional({ nullable: true })
    content!: string | null;

    @ApiPropertyOptional({ nullable: true })
    languageCode!: string | null;

    @ApiProperty({ enum: MomentVisibility })
    visibility!: MomentVisibility;

    @ApiProperty({ enum: MomentStatus })
    status!: MomentStatus;

    @ApiProperty()
    hasRating!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}