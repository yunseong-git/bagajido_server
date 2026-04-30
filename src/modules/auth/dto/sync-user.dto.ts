import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SyncUserDto {
  @ApiPropertyOptional({ description: '닉네임 (users.display_name으로 저장)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nickname?: string;

  @ApiPropertyOptional({ description: '지역 정보' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;
}
