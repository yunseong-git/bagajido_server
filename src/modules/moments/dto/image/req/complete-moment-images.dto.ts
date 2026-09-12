import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsISO8601,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

export class CompleteMomentImageItemDto {
    @ApiProperty()
    @IsString()
    @MaxLength(1024)
    objectKey!: string;

    @ApiPropertyOptional({
        example: 3024,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20000)
    width?: number;

    @ApiPropertyOptional({
        example: 4032,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20000)
    height?: number;

    @ApiPropertyOptional({
        example: '2026-09-11T12:30:00+09:00',
    })
    @IsOptional()
    @IsISO8601()
    takenAt?: string;
}

export class CompleteMomentImagesDto {
    @ApiProperty({
        type: [CompleteMomentImageItemDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => CompleteMomentImageItemDto)
    images!: CompleteMomentImageItemDto[];
}