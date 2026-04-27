import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenPairResponseDto {
  @ApiProperty({ example: 'access-token-value' })
  access_token!: string;

  @ApiProperty({ example: 'refresh-token-value' })
  refresh_token!: string;
}

export class AuthMeResponseDto {
  @ApiProperty({ example: 'google-oauth-subject' })
  oauth_subject!: string;
}
