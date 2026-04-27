import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 'order-uuid' })
  id!: string;

  @ApiProperty({ example: 'user-uuid' })
  user_id!: string;

  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: '12900' })
  total_amount!: string;
}
