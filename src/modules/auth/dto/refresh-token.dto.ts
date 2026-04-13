import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: '리프레시 JWT' })
  @IsString()
  @MinLength(10)
  refresh_token!: string;
}
