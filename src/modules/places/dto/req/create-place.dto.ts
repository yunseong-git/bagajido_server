import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    Max,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

import { CreateExternalSourceDto } from './create-external-source.dto';

export class CreatePlaceDto {
    @ApiProperty({ example: '경복궁' })
    @IsString()
    @MaxLength(200)
    name!: string;

    @ApiPropertyOptional({ format: 'uuid' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ example: '서울특별시 종로구 사직로 161' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '03045' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    postalCode?: string;

    @ApiPropertyOptional({ example: 37.579617 })
    @IsOptional()
    @Type(() => Number)
    @Min(-90)
    @Max(90)
    latitude?: number;

    @ApiPropertyOptional({ example: 126.977041 })
    @IsOptional()
    @Type(() => Number)
    @Min(-180)
    @Max(180)
    longitude?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    businessNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @ApiPropertyOptional({ example: 'https://www.royalpalace.go.kr' })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    websiteUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    operationInfo?: Record<string, unknown>;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    priceInfo?: Record<string, unknown>;

    // TourAPI Import 시 Place 생성 + PlaceExternalSource 생성을 한 transaction에서 처리하기 위함.
    @ApiPropertyOptional({ type: CreateExternalSourceDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateExternalSourceDto)
    externalSource?: CreateExternalSourceDto;
}
