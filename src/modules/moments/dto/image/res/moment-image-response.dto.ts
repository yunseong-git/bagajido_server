import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StorageProvider } from '@prisma/client';

export class MomentImageResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    momentId!: string;

    @ApiProperty({ enum: StorageProvider })
    storageProvider!: StorageProvider;

    @ApiProperty()
    objectKey!: string;

    @ApiProperty()
    imageUrl!: string;

    @ApiProperty()
    sortOrder!: number;

    @ApiPropertyOptional()
    width!: number | null;

    @ApiPropertyOptional()
    height!: number | null;

    @ApiPropertyOptional()
    mimeType!: string | null;

    @ApiPropertyOptional()
    sizeBytes!: number | null;

    @ApiPropertyOptional()
    takenAt!: Date | null;

    @ApiProperty()
    createdAt!: Date;
}