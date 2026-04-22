import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindOrderQueryDto {
  @ApiPropertyOptional({ description: '사용자 ID' })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: '매장 ID' })
  @IsUUID()
  @IsOptional()
  store_id?: string;
}
