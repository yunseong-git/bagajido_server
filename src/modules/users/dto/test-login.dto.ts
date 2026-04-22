import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestLoginDto {
  @ApiProperty({ 
    example: 'test@example.com', 
    description: '기존 유저 로그인을 원하면 이메일을 입력하세요. 미입력 시 랜덤 신규 유저가 생성됩니다.',
    required: false 
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '테스트유저', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}