import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: '결제 상태' })
  @IsString()
  @MaxLength(32)
  @IsOptional()
  payment_status?: string;

  @ApiPropertyOptional({ description: '외부 결제 식별자 (null로 초기화 가능)' })
  @IsString()
  @MaxLength(128)
  @IsOptional()
  external_payment_id?: string;
}
