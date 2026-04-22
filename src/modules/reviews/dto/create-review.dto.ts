import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: '주문 ID' })
  @IsUUID()
  order_id: string;

  @ApiProperty({ description: '메뉴 ID' })
  @IsUUID()
  menu_id: string;

  @ApiPropertyOptional({ description: '가치 점수 (0~100)' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  value_score?: number;

  @ApiPropertyOptional({ description: 'AI 분석 결과 JSON' })
  @IsObject()
  @IsOptional()
  ai_analysis?: Record<string, unknown>;
}
