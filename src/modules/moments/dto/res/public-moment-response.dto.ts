import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    MomentExperienceType,
    MomentVerificationType,
    VisitorType,
} from '@prisma/client';

export class PublicMomentUserResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    username!: string;

    @ApiProperty()
    displayName!: string;

    @ApiPropertyOptional({
        nullable: true,
    })
    profileImageKey!: string | null;
}

export class PublicMomentResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({
        type: PublicMomentUserResponseDto,
    })
    user!: PublicMomentUserResponseDto;

    @ApiProperty({
        example: '2026-09-10',
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

    @ApiPropertyOptional({
        nullable: true,
    })
    content!: string | null;

    @ApiPropertyOptional({
        nullable: true,
    })
    languageCode!: string | null;

    @ApiProperty()
    hasRating!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}