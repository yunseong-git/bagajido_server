import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RunpodAnalysisWebhookDto {
  @ApiProperty({ description: 'RunPod 외부 작업 ID' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  external_job_id!: string;

  @ApiProperty({ description: '리뷰 UUID' })
  @IsUUID()
  review_id!: string;

  @ApiPropertyOptional({ description: '가성비 점수' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value_score?: number;

  @ApiPropertyOptional({ description: 'AI 분석 JSON' })
  @IsOptional()
  @IsObject()
  ai_analysis?: Record<string, unknown>;

  @ApiPropertyOptional({ description: '서명 검증용 (Phase 1 훅)' })
  @IsOptional()
  @IsString()
  signature?: string;
}
