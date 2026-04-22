import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateMenuDto {
  @ApiPropertyOptional({ description: '메뉴명' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '참고 이미지 URL' })
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  @IsOptional()
  reference_image_url?: string;

  @ApiPropertyOptional({ description: '1인분 기준 중량(그램), null 허용' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  portion_grams?: number;
}
