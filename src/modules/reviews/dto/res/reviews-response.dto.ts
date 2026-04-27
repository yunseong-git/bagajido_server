import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ example: 'review-uuid' })
  id!: string;

  @ApiProperty({ example: 'user-uuid' })
  user_id!: string;

  @ApiProperty({ example: 'order-uuid' })
  order_id!: string;

  @ApiProperty({ example: 'menu-uuid' })
  menu_id!: string;

  @ApiProperty({ example: '4.50', required: false, nullable: true })
  value_score?: string | null;
}
