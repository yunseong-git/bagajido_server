import { ApiProperty } from '@nestjs/swagger';

export class RunpodWebhookResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: 'accepted' })
  status!: string;
}
