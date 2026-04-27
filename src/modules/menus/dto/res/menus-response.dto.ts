import { ApiProperty } from '@nestjs/swagger';

export class MenuResponseDto {
  @ApiProperty({ example: 'menu-uuid' })
  id!: string;

  @ApiProperty({ example: 'place_12345' })
  place_id!: string;

  @ApiProperty({ example: '김치찌개' })
  name!: string;

  @ApiProperty({ example: 'https://example.com/menu.jpg' })
  reference_image_url!: string;

  @ApiProperty({ example: 300, required: false, nullable: true })
  portion_grams?: number | null;
}
