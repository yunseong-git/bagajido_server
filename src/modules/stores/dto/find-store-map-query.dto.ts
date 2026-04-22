import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindStoreMapQueryDto {
  @ApiProperty({ description: '좌측 하단 경도', example: 126.9 })
  @Type(() => Number)
  @IsNumber()
  xmin: number;

  @ApiProperty({ description: '좌측 하단 위도', example: 37.5 })
  @Type(() => Number)
  @IsNumber()
  ymin: number;

  @ApiProperty({ description: '우측 상단 경도', example: 127.1 })
  @Type(() => Number)
  @IsNumber()
  xmax: number;

  @ApiProperty({ description: '우측 상단 위도', example: 37.6 })
  @Type(() => Number)
  @IsNumber()
  ymax: number;

  @ApiProperty({ description: '현재 지도 줌 레벨', example: 14 })
  @Type(() => Number)
  @IsNumber()
  zoom: number;
}
