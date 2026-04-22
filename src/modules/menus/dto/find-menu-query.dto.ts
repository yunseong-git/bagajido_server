import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindMenuQueryDto {
  @ApiPropertyOptional({ description: '매장 ID로 필터링' })
  @IsUUID()
  @IsOptional()
  store_id?: string;
}
