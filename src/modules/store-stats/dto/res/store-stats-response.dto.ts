import { ApiProperty } from '@nestjs/swagger';

export class StoreStatsListResponseDto {
  @ApiProperty({ type: [Object], example: [] })
  items!: object[];
}
