import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '매장 place_id (외부 API 등)' })
  @IsString()
  @MaxLength(255)
  place_id: string;

  @ApiProperty({ description: '메뉴명' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: '참고 이미지 URL' })
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  reference_image_url: string;

  @ApiPropertyOptional({ description: '1인분 기준 중량(그램)' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  portion_grams?: number;
}
