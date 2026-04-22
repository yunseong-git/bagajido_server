import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';

export class UpdateReviewDto {
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
