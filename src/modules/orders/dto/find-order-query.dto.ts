import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class FindOrderQueryDto {
  @ApiPropertyOptional({ description: '사용자 ID' })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ description: '매장 place_id' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  place_id?: string;
}
