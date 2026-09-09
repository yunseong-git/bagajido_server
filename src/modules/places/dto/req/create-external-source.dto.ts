import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceExternalProvider } from '@prisma/client';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExternalSourceDto {
    @ApiProperty({ enum: PlaceExternalProvider, example: PlaceExternalProvider.TOUR_API })
    @IsEnum(PlaceExternalProvider)
    provider!: PlaceExternalProvider;

    @ApiProperty({ example: '126508' })
    @IsString()
    @MaxLength(255)
    externalId!: string;

    @ApiPropertyOptional({ example: '39' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    externalType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    sourceUpdatedAt?: string;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    rawData?: Record<string, unknown>;
}
