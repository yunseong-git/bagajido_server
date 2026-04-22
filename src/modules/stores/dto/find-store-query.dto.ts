import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindStoresQueryDto {
  @ApiProperty({ description: '좌측 하단 경도(Longitude)', example: 126.90 })
  @Type(() => Number) // 쿼리 스트링(문자열)을 숫자로 변환
  @IsNumber()
  xmin: number;

  @ApiProperty({ description: '좌측 하단 위도(Latitude)', example: 37.50 })
  @Type(() => Number)
  @IsNumber()
  ymin: number;

  @ApiProperty({ description: '우측 상단 경도(Longitude)', example: 127.10 })
  @Type(() => Number)
  @IsNumber()
  xmax: number;

  @ApiProperty({ description: '우측 상단 위도(Latitude)', example: 37.60 })
  @Type(() => Number)
  @IsNumber()
  ymax: number;
}