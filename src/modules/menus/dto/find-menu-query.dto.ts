import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FindMenuQueryDto {
  @ApiPropertyOptional({ description: '매장 place_id로 필터링' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  place_id?: string;
}
