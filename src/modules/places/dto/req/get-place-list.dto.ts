import { Type } from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PlaceStatus } from '@prisma/client';


//pagination은 일단 offset 방식,나중에 피드/검색 규모 커지면 바꾸면 됨
export class GetPlaceListDto {
  @ApiPropertyOptional({
    example: '경복궁',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  query?: string;

  @ApiPropertyOptional({
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: PlaceStatus,
    default: PlaceStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PlaceStatus)
  status?: PlaceStatus = PlaceStatus.ACTIVE;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}